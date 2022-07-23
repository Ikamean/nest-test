import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameRequestDto } from '../dtos/create-game-request.dto';
import { UpdateGameRequestDto } from '../dtos/update-game-request.dto';
import {
  IEndGameResponse,
  IGameMode,
  IGameSession,
  IUpdateGameResponse,
} from '../interfaces';
import { SessionService } from './session.service';
import { HTTP_CODE } from 'src/enums';
import { BetService } from './bet.service';
import { AuthService } from './auth.service';
import { CustomPutRequestValidator } from 'src/custom-validators/put-request-body.validator';

const GAME_MODE: IGameMode = {
  normal: 'normal',
  testing: 'testing',
};

@Injectable()
export class GameService {
  constructor(
    private sessionService: SessionService,
    private betService: BetService,
    private authService: AuthService,
    private customPutRequestValidator: CustomPutRequestValidator,
  ) {}

  create(
    body: CreateGameRequestDto,
    session: IGameSession,
    authorization: string,
  ) {
    if (this.sessionService.isGameInitialized())
      throw new HttpException(
        HTTP_CODE.GAME_IN_PROGRESS,
        HttpStatus.BAD_REQUEST,
      );
    let balance = 0;
    const gameMode = body.gameMode;
    const gameModeIsNormal = gameMode === GAME_MODE.normal;

    if (gameModeIsNormal) {
      const tokenPayload = this.authService.decodeJwt(
        authorization.split(' ')[1],
      );
      balance = tokenPayload;
    } else {
      balance = body.balance;
    }

    this.sessionService.initializeSession(session, balance, gameMode);
  }

  update(body: UpdateGameRequestDto): IUpdateGameResponse {
    if (!this.sessionService.isGameInitialized())
      throw new HttpException(HTTP_CODE.GAME_NOT_FOUND, HttpStatus.NOT_FOUND);

    const totalBetAmount = this.betService.calculateTotalBetAmount(
      body.betInfo,
    );

    if (!totalBetAmount)
      throw new HttpException(HTTP_CODE.INVALID_BODY, HttpStatus.BAD_REQUEST);

    if (!this.sessionService.isBalanceEnough(totalBetAmount))
      throw new HttpException(
        HTTP_CODE.NOT_ENOUGH_BALANCE,
        HttpStatus.BAD_REQUEST,
      );

    const gameModeIsTesting =
      this.sessionService.getGameSession().gameMode === GAME_MODE.testing;
    let winningNumber = 0;

    if (gameModeIsTesting) {
      this.customPutRequestValidator.validate(body);
      winningNumber = body.winningNumber;
    } else {
      winningNumber = this.betService.randomizeWinningNumber();
    }

    this.sessionService.setWinningNumber(winningNumber);

    const betsResults = this.betService.calculateBetsResults(body.betInfo);

    this.sessionService.setTotalBalance(betsResults.totalBetResults);

    return {
      balance: this.sessionService.getGameSession().balance,
      winningBets: betsResults.wonBetsArray,
      winningNumber: this.sessionService.getGameSession().winningNumber,
    };
  }

  endGame(): IEndGameResponse {
    if (!this.sessionService.isGameInitialized())
      throw new HttpException(HTTP_CODE.GAME_NOT_FOUND, HttpStatus.NOT_FOUND);
    const respObject = this.sessionService.getGameSession();
    this.sessionService.endGame();

    return {
      startBalance: respObject.startBalance,
      endBalance: respObject.balance,
    };
  }
}
