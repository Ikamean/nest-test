import { Module } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { GameController } from '../controllers/game.controller';
import { SessionService } from '../services/session.service';
import { BetService } from 'src/services/bet.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth.module';
import { CustomPutRequestValidator } from 'src/custom-validators/put-request-body.validator';

@Module({
  imports: [AuthModule],
  controllers: [GameController],
  providers: [
    GameService,
    SessionService,
    BetService,
    ConfigService,
    JwtService,
    CustomPutRequestValidator,
  ],
})
export class GameModule {}
