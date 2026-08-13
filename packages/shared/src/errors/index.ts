/**
 * Standard error hierarchy for OpenBoard.
 */
export class OpenBoardError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string = 'OPENBOARD_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'OpenBoardError';
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BoardNotFoundError extends OpenBoardError {
  constructor(boardId: string) {
    super(`Board with ID "${boardId}" was not found.`, 'BOARD_NOT_FOUND', 404);
    this.name = 'BoardNotFoundError';
  }
}

export class BoardValidationError extends OpenBoardError {
  constructor(message: string) {
    super(message, 'BOARD_VALIDATION_ERROR', 400);
    this.name = 'BoardValidationError';
  }
}

export class StorageOperationError extends OpenBoardError {
  constructor(message: string, cause?: unknown) {
    super(message, 'STORAGE_OPERATION_ERROR', 500);
    this.name = 'StorageOperationError';
    if (cause) {
      this.cause = cause;
    }
  }
}
