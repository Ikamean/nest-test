import { IBetInfoItem } from 'src/interfaces';
import {
  IsNotEmpty,
  IsArray,
  IsInt,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BetInfoItemDto } from './betInfo-item.dto';

export class UpdateGameRequestDto {
  @ApiProperty({
    description: 'Bet Info',
    type: [BetInfoItemDto],
    minItems: 1,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  betInfo: IBetInfoItem[];

  @ApiProperty({
    description:
      'Winning number must be in body if game is in test mode, if gameMode is normal winningNumber will be generated randomly',
    required: false,
    minimum: 0,
    maximum: 36,
  })
  @IsOptional()
  @IsInt()
  winningNumber?: number;
}
