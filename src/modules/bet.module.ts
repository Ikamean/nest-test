import { Module } from '@nestjs/common';
import { SessionService } from 'src/services/session.service';
import { BetService } from '../services/bet.service';

@Module({
  providers: [BetService, SessionService],
})
export class BetModule {}
