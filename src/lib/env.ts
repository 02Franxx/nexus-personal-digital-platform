import 'server-only';

/**
 * Server-side environment configuration.
 *
 * Keep this module out of Client Components. It intentionally reads secrets
 * only when a server-side feature imports it.
 */

type Environment = {
  databaseUrl: string;
  authSecret: string;
  smtp: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
};

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Add it to .env.local.`);
  }
  return value;
}

function port(): number {
  const value = required('SMTP_PORT');
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid SMTP_PORT: expected an integer between 1 and 65535, received "${value}".`);
  }
  return parsed;
}

export function loadEnvironment(): Environment {
  return {
    databaseUrl: required('DATABASE_URL'),
    authSecret: required('AUTH_SECRET'),
    smtp: {
      host: required('SMTP_HOST'),
      port: port(),
      user: required('SMTP_USER'),
      password: required('SMTP_PASSWORD'),
    },
  };
}
