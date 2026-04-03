import { redis } from './redis';

const LOGIN_RATE_LIMIT = {
  max_failures: 5,
  failure_window_seconds: 60 * 10,
  block_duration_seconds: 60 * 10,
} as const;

type LoginAttemptIdentity = {
  ip?: string;
  email?: string;
};

export class LoginBlockedError extends Error {
  constructor(public readonly retry_after_seconds: number) {
    super('Login blocked due to too many failed attempts');
    this.name = 'LoginBlockedError';
  }
}

function normalize(value?: string): string {
  return (value ?? 'unknown').trim().toLowerCase();
}

function buildIdentityKey(identity: LoginAttemptIdentity): string {
  const ip = normalize(identity.ip);
  const email = normalize(identity.email);

  return `${ip}:${email}`;
}

function buildRedisKeys(identity: LoginAttemptIdentity) {
  const identity_key = buildIdentityKey(identity);

  return {
    failures_key: `login:failures:${identity_key}`,
    blocked_key: `login:blocked:${identity_key}`,
  };
}

export async function assertLoginIsNotBlocked(
  identity: LoginAttemptIdentity,
): Promise<void> {
  const { blocked_key } = buildRedisKeys(identity);
  const retry_after_seconds = await redis.ttl(blocked_key);

  if (retry_after_seconds > 0) {
    throw new LoginBlockedError(retry_after_seconds);
  }
}

export async function registerLoginFailure(
  identity: LoginAttemptIdentity,
): Promise<void> {
  const { failures_key, blocked_key } = buildRedisKeys(identity);
  const failures = await redis.incr(failures_key);

  if (failures === 1) {
    await redis.expire(
      failures_key,
      LOGIN_RATE_LIMIT.failure_window_seconds,
    );
  }

  const user_should_be_blocked =
    failures > LOGIN_RATE_LIMIT.max_failures;

  if (!user_should_be_blocked) {
    return;
  }

  await redis.set(blocked_key, '1', {
    ex: LOGIN_RATE_LIMIT.block_duration_seconds,
  });

  await redis.del(failures_key);

  throw new LoginBlockedError(LOGIN_RATE_LIMIT.block_duration_seconds);
}

export async function clearLoginFailures(
  identity: LoginAttemptIdentity,
): Promise<void> {
  const { failures_key } = buildRedisKeys(identity);

  await redis.del(failures_key);
}