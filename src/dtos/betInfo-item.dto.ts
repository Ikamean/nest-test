import { IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BetInfoItemDto {
  @ApiProperty({
    description: 'value can be number in range [0-36], or string : [odd,even]',
  })
  @IsNotEmpty()
  betType: number;
  @ApiProperty({ minimum: 1 })
  @IsNotEmpty()
  @Min(1)
  betAmount: number;
}
