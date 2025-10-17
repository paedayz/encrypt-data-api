import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const NodeRSA = require('node-rsa');
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private privateKey: any;
  private publicKey: any;

  constructor() {
    this.initializeKeys();
  }

  private initializeKeys(): void {
    try {
      const key = new NodeRSA({ b: 2048 });
      this.privateKey = key;
      this.publicKey = new NodeRSA(key.exportKey('public'));

      this.logger.log('RSA keys initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize RSA keys:', error);
      throw new Error('Failed to initialize encryption keys');
    }
  }

  generateAESKey(): string {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  }

  encryptAES(data: string, key: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, key).toString();
      return encrypted;
    } catch (error) {
      this.logger.error('AES encryption failed:', error);
      throw new Error('AES encryption failed');
    }
  }

  decryptAES(encryptedData: string, key: string): string {
    try {
      if (!encryptedData || !/^[A-Za-z0-9+/]*={0,2}$/.test(encryptedData)) {
        throw new Error('Invalid encrypted data format');
      }

      const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
      const result = decrypted.toString(CryptoJS.enc.Utf8);

      if (decrypted.sigBytes < 0) {
        throw new Error('Invalid encrypted data or key');
      }

      return result;
    } catch (error) {
      this.logger.error('AES decryption failed:', error);
      throw new Error('AES decryption failed');
    }
  }

  encryptRSA(data: string): string {
    try {
      const encrypted = this.publicKey.encrypt(data, 'base64');
      return encrypted;
    } catch (error) {
      this.logger.error('RSA encryption failed:', error);
      throw new Error('RSA encryption failed');
    }
  }

  decryptRSA(encryptedData: string): string {
    try {
      const decrypted = this.privateKey.decrypt(encryptedData, 'utf8');
      return decrypted;
    } catch (error) {
      this.logger.error('RSA decryption failed:', error);
      throw new Error('RSA decryption failed');
    }
  }

  getPublicKey(): string {
    return this.publicKey.exportKey('public');
  }

  getPrivateKey(): string {
    return this.privateKey.exportKey('private');
  }
}
