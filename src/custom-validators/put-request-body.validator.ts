import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UpdateGameRequestDto } from 'src/dtos/update-game-request.dto';
import { HTTP_CODE, PRIMITIVES } from '../enums';

@ValidatorConstraint({ name: 'custom-validator', async: false })
export class CustomPutRequestValidator implements ValidatorConstraintInterface {
  validate(body: UpdateGameRequestDto) {
    const winningNumberIsPresent = !!body.winningNumber;
    const winningNumberIsNumber =
      typeof body.winningNumber === PRIMITIVES.number;
    const winningNumberIsInRange =
      body.winningNumber >= 0 && body.winningNumber <= 36;

    const isBodyValid =
      winningNumberIsPresent && winningNumberIsNumber && winningNumberIsInRange;

    if (isBodyValid) return true;

    const errorMessageArray = [HTTP_CODE.INVALID_BODY];

    if (!winningNumberIsPresent) {
      errorMessageArray.push(HTTP_CODE.WINNING_NUMBER_IS_MISSING);
      errorMessageArray.push(HTTP_CODE.WINNING_NUMBER_MUST_BE_NUMBER);
      errorMessageArray.push(HTTP_CODE.WINNING_NUMBER_NOT_IN_RANGE);
    }

    if (winningNumberIsPresent && !winningNumberIsNumber)
      errorMessageArray.push(HTTP_CODE.WINNING_NUMBER_MUST_BE_NUMBER);

    if (
      winningNumberIsPresent &&
      winningNumberIsNumber &&
      !winningNumberIsInRange
    )
      errorMessageArray.push(HTTP_CODE.WINNING_NUMBER_NOT_IN_RANGE);

    const customError = {
      status: HttpStatus.BAD_REQUEST,
      message: errorMessageArray,
      error: HTTP_CODE.BAD_REQUEST,
    };

    throw new HttpException(customError, HttpStatus.BAD_REQUEST);
  }
}
