import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EncryptionService } from './encryption.service';
import { EncryptRequestDto, DecryptRequestDto } from '../dto';
import {
  ApiResponseDto,
  EncryptResponseData,
  DecryptResponseData,
} from '../dto/api-response.dto';

@ApiTags('Encryption')
@Controller()
export class EncryptionController {
  private readonly logger = new Logger(EncryptionController.name);

  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('get-encrypt-data')
  @ApiOperation({
    summary: 'Encrypt payload data',
    description:
      'Encrypts the provided payload using AES encryption with a randomly generated key, then encrypts the AES key using RSA private key.',
  })
  @ApiBody({ type: EncryptRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Data encrypted successfully',
    type: ApiResponseDto<EncryptResponseData>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ApiResponseDto,
  })
  async encryptData(
    @Body() encryptRequest: EncryptRequestDto,
  ): Promise<ApiResponseDto<EncryptResponseData>> {
    try {
      this.logger.log('Encrypt data request received');

      const { payload } = encryptRequest;

      const aesKey = this.encryptionService.generateAESKey();
      this.logger.debug('AES key generated');

      const encryptedPayload = this.encryptionService.encryptAES(
        payload,
        aesKey,
      );
      this.logger.debug('Payload encrypted with AES');

      const encryptedAESKey = this.encryptionService.encryptRSA(aesKey);
      this.logger.debug('AES key encrypted with RSA private key');

      const response: ApiResponseDto<EncryptResponseData> = {
        successful: true,
        data: {
          data1: encryptedAESKey,
          data2: encryptedPayload,
        },
      };

      this.logger.log('Data encrypted successfully');
      return response;
    } catch (error) {
      this.logger.error('Encryption failed:', error);
      throw new HttpException(
        {
          successful: false,
          error_code: 'ENCRYPTION_ERROR',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('get-decrypt-data')
  @ApiOperation({
    summary: 'Decrypt payload data',
    description:
      'Decrypts the provided encrypted data by first decrypting the AES key using RSA public key, then decrypting the payload using the AES key.',
  })
  @ApiBody({ type: DecryptRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Data decrypted successfully',
    type: ApiResponseDto<DecryptResponseData>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ApiResponseDto,
  })
  async decryptData(
    @Body() decryptRequest: DecryptRequestDto,
  ): Promise<ApiResponseDto<DecryptResponseData>> {
    try {
      this.logger.log('Decrypt data request received');

      const { data1, data2 } = decryptRequest;

      const aesKey = this.encryptionService.decryptRSA(data1);
      this.logger.debug('AES key decrypted with RSA public key');

      const decryptedPayload = this.encryptionService.decryptAES(data2, aesKey);
      this.logger.debug('Payload decrypted with AES key');

      const response: ApiResponseDto<DecryptResponseData> = {
        successful: true,
        data: {
          payload: decryptedPayload,
        },
      };

      this.logger.log('Data decrypted successfully');
      return response;
    } catch (error) {
      this.logger.error('Decryption failed:', error);
      throw new HttpException(
        {
          successful: false,
          error_code: 'DECRYPTION_ERROR',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
