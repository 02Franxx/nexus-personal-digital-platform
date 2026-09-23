export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  constructor(
    code: ErrorCode,
    message: string,
  ) {
    super(message);

    this.name = 'AppError';
    this.code = code;
    this.statusCode = ERROR_STATUS_MAP[code];
  }
}

export type HttpErrorResponse = {
  statusCode: number;
  body: {
    error: {
      code: ErrorCode;
      message: string;
    };
  };
};

export function toHttpErrorResponse(error: unknown): HttpErrorResponse {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: {
          code: error.code,
          message: error.message,
        },
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred.',
      },
    },
  };
}
