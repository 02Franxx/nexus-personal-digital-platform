import assert from 'node:assert/strict';
import test from 'node:test';
import { AppError, retryAfterSeconds, toApiErrorBody, toHttpErrorResponse } from '../src/lib/errors.ts';

test('AppError preserves the public API contract and mapped status', () => {
  const error = new AppError('NOT_FOUND', 'User not found.');
  assert.deepEqual(toApiErrorBody(error), {
    error: { code: 'NOT_FOUND', message: 'User not found.' },
  });
  assert.deepEqual(toHttpErrorResponse(error), {
    statusCode: 404,
    body: { error: { code: 'NOT_FOUND', message: 'User not found.' }, },
  });
});

test('every public error code maps to its intended HTTP status', () => {
  const expected = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    RATE_LIMITED: 429,
    INTERNAL_ERROR: 500,
  };

  for (const [code, statusCode] of Object.entries(expected)) {
    const response = toHttpErrorResponse(new AppError(code, `${code} message`));
    assert.equal(response.statusCode, statusCode);
    assert.equal(response.body.error.code, code);
  }
});

test('unknown errors are sanitized before leaving the server', () => {
  const response = toHttpErrorResponse(new Error('SECRET DATABASE ERROR'));
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error.code, 'INTERNAL_ERROR');
  assert.equal(response.body.error.message, 'An unexpected error occurred.');
  assert.equal(JSON.stringify(response).includes('SECRET DATABASE ERROR'), false);
});

test('retry delay is only exposed for rate-limited errors', () => {
  assert.equal(retryAfterSeconds(new AppError('RATE_LIMITED', 'Too many requests.')), 60);
  assert.equal(retryAfterSeconds(new AppError('UNAUTHORIZED', 'No session.')), null);
  assert.equal(retryAfterSeconds(new Error('internal')), null);
});
