import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DecryptRequestDto {
  @ApiProperty({
    description: 'Encrypted AES key (data1)',
    example: 'encrypted_aes_key_string',
  })
  @IsString()
  @IsNotEmpty()
  data1: string;

  @ApiProperty({
    description: 'Encrypted payload (data2)',
    example: 'encrypted_payload_string',
  })
  @IsString()
  @IsNotEmpty()
  data2: string;
}
