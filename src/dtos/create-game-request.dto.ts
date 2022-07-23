import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, ValidateIf, Min } from 'class-validator';
import { GAME_MODE } from 'src/enums';

export class CreateGameRequestDto {
  @ApiProperty({ description: 'normal | testing' })
  @IsString()
  @IsNotEmpty()
  gameMode: GAME_MODE.normal | GAME_MODE.testing;

  @ValidateIf((o) => o.gameMode === GAME_MODE.testing)
  @ApiProperty({
    description:
      'Must exist in body if gameMode is testing, if gameMode is normal balance must be in token',
    required: false,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  balance?: number;
}
