import { Injectable } from '@nestjs/common';
import { IBetInfoItem } from '../interfaces';
import { SessionService } from './session.service';
import {
  BET_TYPE,
  PRIMITIVES,
  RESULT_TYPE,
  WINNING_COEFFICIENT,
} from '../enums';

@Injectable()
export class BetService {
  constructor(private sessionService: SessionService) {}

  randomizeWinningNumber() {
    return Math.floor(Math.random() * 36);
  }

  isNumberOdd(value: number) {
    if (value === 0) return false;

    return value % 2 === 0;
  }

  calculateTotalBetAmount(bets: IBetInfoItem[]) {
    const totalAmount = bets
      .map((el: IBetInfoItem) => el.betAmount)
      .reduce((prev: number, curr: number) => prev + curr);
    return totalAmount;
  }

  sumBetAmount(bets: IBetInfoItem[]) {
    let sum = 0;
    bets.forEach((el) => {
      if (el.winningCoefficient)
        return (sum += el.betAmount * el.winningCoefficient);
      sum += el.betAmount;
    });

    return sum;
  }

  private filterBets(
    bets: IBetInfoItem[],
    winningNumber: number,
    winningNumberIsOdd: boolean,
    winningNumberIsZero: boolean,
    type: string,
  ) {
    return bets.filter((el) => {
      const isNumber = typeof el.betType === PRIMITIVES.number;
      const isTypeOdd = el.betType === BET_TYPE.odd;
      const isTypeEven = el.betType === BET_TYPE.even;
      const isNotEqualToWinningNumber = el.betType !== winningNumber;
      const isNotEqualToZero = el.betType !== 0;

      if (type === RESULT_TYPE.lost) {
        if (winningNumberIsZero && isNotEqualToZero) return el;

        if (isNumber && isNotEqualToWinningNumber) {
          return el;
        }

        if (
          !isNumber &&
          ((isTypeOdd && !winningNumberIsOdd) ||
            (!isTypeOdd && winningNumberIsOdd))
        ) {
          return el;
        }
      } else {
        if (
          (isNumber && !isNotEqualToWinningNumber) ||
          (isTypeOdd && winningNumberIsOdd) ||
          (isTypeEven && !winningNumberIsOdd)
        ) {
          if (isNumber) {
            el.winningCoefficient = WINNING_COEFFICIENT.number;
          } else {
            el.winningCoefficient = WINNING_COEFFICIENT.even_odd;
          }
          return el;
        }
      }
    });
  }

  calculateBetsResults(bets: IBetInfoItem[]) {
    const winningNumber = this.sessionService.getGameSession().winningNumber;
    const winningNumberIsOdd = this.isNumberOdd(winningNumber);
    const winningNumberIsZero = winningNumber === 0;

    const lostBetsArray = this.filterBets(
      bets,
      winningNumber,
      winningNumberIsOdd,
      winningNumberIsZero,
      RESULT_TYPE.lost,
    );
    const wonBetsArray = this.filterBets(
      bets,
      winningNumber,
      winningNumberIsOdd,
      winningNumberIsZero,
      RESULT_TYPE.won,
    );
    const lostBetsTotal = this.sumBetAmount(lostBetsArray);
    const wonBetsTotal = this.sumBetAmount(wonBetsArray);

    return { totalBetResults: wonBetsTotal - lostBetsTotal, wonBetsArray };
  }
}
