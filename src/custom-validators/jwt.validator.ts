import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HTTP_CODE, PRIMITIVES } from '../enums';
import { IJwtPayload } from '../interfaces';

@ValidatorConstraint({ name: 'custom-validator', async: false })
export class CustomJwtValidator implements ValidatorConstraintInterface {
  validate(jwt: IJwtPayload) {
    const balanceIsPresent = !!jwt.balance;
    const balanceIsNumber = typeof jwt.balance === PRIMITIVES.number;
    const balanceIsGreaterThanZero = jwt.balance > 0;
    const isTokenValid =
      balanceIsPresent && balanceIsNumber && balanceIsGreaterThanZero;

    if (isTokenValid) return true;

    const errorMessageArray = [HTTP_CODE.INVALID_TOKEN];

    if (!balanceIsPresent) {
      errorMessageArray.push(HTTP_CODE.BALANCE_IS_MISSING);
      errorMessageArray.push(HTTP_CODE.BALANCE_MUST_BE_NUMBER);
      errorMessageArray.push(HTTP_CODE.BALANCE_MUST_BE_MORE_THAN_ZERO);
    }

    if (balanceIsPresent && !balanceIsNumber)
      errorMessageArray.push(HTTP_CODE.BALANCE_MUST_BE_NUMBER);

    if (balanceIsPresent && balanceIsNumber && !balanceIsGreaterThanZero)
      errorMessageArray.push(HTTP_CODE.BALANCE_MUST_BE_MORE_THAN_ZERO);

    const customError = {
      status: HttpStatus.BAD_REQUEST,
      message: errorMessageArray,
      error: HTTP_CODE.BAD_REQUEST,
    };

    throw new HttpException(customError, HttpStatus.BAD_REQUEST);
  }
}
