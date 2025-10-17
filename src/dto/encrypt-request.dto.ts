import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class EncryptRequestDto {
  @ApiProperty({
    description: 'Payload to be encrypted',
    example: 'Hello, this is a test message',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, { message: 'Payload must not exceed 2000 characters' })
  payload: string;
}
