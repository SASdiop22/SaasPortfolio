import { AppError } from './AppError';

export class BadRequestException extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}