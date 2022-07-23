import { Session } from 'express-session';

export type GameModeTypes = 'normal' | 'testing';
export type BetTypes = number | string;

export interface IGameSession extends Session {
  balance: number;
  gameMode: GameModeTypes;
  startBalance: number;
  winningNumber: number;
}

export interface IGameMode {
  normal: string;
  testing: string;
}

export interface IBetInfoItem {
  betAmount: number;
  betType: BetTypes;
  winningCoefficient?: number;
}

export interface IJwtPayload {
  balance: number;
}

export interface IUpdateGameResponse {
  balance: number;
  winningBets: IBetInfoItem[];
  winningNumber: number;
}

export interface IEndGameResponse {
  startBalance: number;
  endBalance: number;
}
