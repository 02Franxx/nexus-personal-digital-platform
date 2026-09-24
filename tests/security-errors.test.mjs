import assert from 'node:assert/strict';
import test from 'node:test';
import { AppError, toApiErrorBody, toHttpErrorResponse } from '../src/lib/errors.ts';

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

test('unknown errors are sanitized before leaving the server', () => {
  const response = toHttpErrorResponse(new Error('SECRET DATABASE ERROR'));
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error.code, 'INTERNAL_ERROR');
  assert.equal(response.body.error.message, 'An unexpected error occurred.');
  assert.equal(JSON.stringify(response).includes('SECRET DATABASE ERROR'), false);
});
