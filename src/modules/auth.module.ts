import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CustomJwtValidator } from 'src/custom-validators/jwt.validator';
import { JwtStrategy } from 'src/jwt.strategy';
import { AuthService } from 'src/services/auth.service';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    JwtModule.registerAsync(jwtFactory),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtStrategy, AuthService, CustomJwtValidator],
  exports: [JwtModule, JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
