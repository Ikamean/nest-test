import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Session,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { GameService } from '../services/game.service';
import { CreateGameRequestDto } from '../dtos/create-game-request.dto';
import { UpdateGameRequestDto } from '../dtos/update-game-request.dto';
import {
  IEndGameResponse,
  IGameSession,
  IUpdateGameResponse,
} from '../interfaces';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')
@UseGuards(AuthGuard())
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create')
  create(
    @Headers('Authorization') authorization = '',
    @Body() body: CreateGameRequestDto,
    @Session() session: IGameSession,
  ) {
    return this.gameService.create(body, session, authorization);
  }

  @Patch('spin')
  update(@Body() body: UpdateGameRequestDto): IUpdateGameResponse {
    return this.gameService.update(body);
  }

  @Delete('end')
  remove(): IEndGameResponse {
    return this.gameService.endGame();
  }
}
