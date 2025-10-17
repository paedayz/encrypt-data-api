import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the operation was successful',
    example: true,
  })
  successful: boolean;

  @ApiProperty({
    description: 'Error code if operation failed',
    example: 'VALIDATION_ERROR',
    required: false,
  })
  error_code?: string;

  @ApiProperty({
    description: 'Response data',
    example: null,
    required: false,
  })
  data?: T | null;
}

export class EncryptResponseData {
  @ApiProperty({
    description: 'Encrypted AES key (data1)',
    example: 'encrypted_aes_key_string',
  })
  data1: string;

  @ApiProperty({
    description: 'Encrypted payload (data2)',
    example: 'encrypted_payload_string',
  })
  data2: string;
}

export class DecryptResponseData {
  @ApiProperty({
    description: 'Decrypted payload',
    example: 'Hello, this is a test message',
  })
  payload: string;
}
