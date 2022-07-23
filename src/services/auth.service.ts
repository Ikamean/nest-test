import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CustomJwtValidator } from 'src/custom-validators/jwt.validator';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private customJwtValidator: CustomJwtValidator,
  ) {}
  decodeJwt(token: string): number {
    const decodedJwtAccessToken: any = this.jwtService.decode(token);

    this.customJwtValidator.validate(decodedJwtAccessToken);

    return decodedJwtAccessToken.balance;
  }
}
