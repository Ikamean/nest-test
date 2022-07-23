import { Module } from '@nestjs/common';
import { GameModule } from './game.module';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './session.module';
import { BetModule } from './bet.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    GameModule,
    SessionModule,
    BetModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
