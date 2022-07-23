import { Injectable } from '@nestjs/common';
import { BetTypes, GameModeTypes, IGameSession } from 'src/interfaces';

@Injectable()
export class SessionService {
  private session: IGameSession;

  initializeSession(
    session: IGameSession,
    balance: number,
    gameMode: GameModeTypes,
  ) {
    this.session = session;
    this.session.balance = balance;
    this.session.startBalance = balance;
    this.session.gameMode = gameMode;
  }

  isGameInitialized() {
    return !!this.session && !!this.session.gameMode;
  }

  getGameSession() {
    return {
      balance: this.session.balance,
      gameMode: this.session.gameMode,
      startBalance: this.session.startBalance,
      winningNumber: this.session.winningNumber,
    };
  }

  endGame() {
    this.session.destroy(() => console.log('Session Destroied'));
    this.session = null;
  }

  isBalanceEnough(totalBetAmount: number) {
    return this.session.balance >= totalBetAmount;
  }

  setTotalBalance(totalAmount: number) {
    this.session.balance = this.session.balance + totalAmount;
  }

  setWinningNumber(winningNumber: number) {
    this.session.winningNumber = winningNumber;
  }
}
