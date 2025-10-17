import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AES Operations', () => {
    it('should generate a valid AES key', () => {
      const key = service.generateAESKey();
      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });

    it('should encrypt and decrypt data with AES', () => {
      const testData = 'Hello, World!';
      const key = service.generateAESKey();

      const encrypted = service.encryptAES(testData, key);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(testData);

      const decrypted = service.decryptAES(encrypted, key);
      expect(decrypted).toBe(testData);
    });

    it('should handle empty string encryption/decryption', () => {
      const testData = '';
      const key = service.generateAESKey();

      const encrypted = service.encryptAES(testData, key);
      const decrypted = service.decryptAES(encrypted, key);
      expect(decrypted).toBe(testData);
    });

    it('should handle special characters in AES encryption/decryption', () => {
      const testData = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const key = service.generateAESKey();

      const encrypted = service.encryptAES(testData, key);
      const decrypted = service.decryptAES(encrypted, key);
      expect(decrypted).toBe(testData);
    });
  });

  describe('RSA Operations', () => {
    it('should encrypt and decrypt data with RSA', () => {
      const testData = 'Hello, World!';

      const encrypted = service.encryptRSA(testData);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(testData);

      const decrypted = service.decryptRSA(encrypted);
      expect(decrypted).toBe(testData);
    });

    it('should handle empty string RSA encryption/decryption', () => {
      const testData = '';

      const encrypted = service.encryptRSA(testData);
      const decrypted = service.decryptRSA(encrypted);
      expect(decrypted).toBe(testData);
    });

    it('should handle special characters in RSA encryption/decryption', () => {
      const testData = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';

      const encrypted = service.encryptRSA(testData);
      const decrypted = service.decryptRSA(encrypted);
      expect(decrypted).toBe(testData);
    });
  });

  describe('Key Management', () => {
    it('should return public key', () => {
      const publicKey = service.getPublicKey();
      expect(publicKey).toBeDefined();
      expect(typeof publicKey).toBe('string');
      expect(publicKey).toContain('BEGIN PUBLIC KEY');
    });

    it('should return private key', () => {
      const privateKey = service.getPrivateKey();
      expect(privateKey).toBeDefined();
      expect(typeof privateKey).toBe('string');
      expect(privateKey).toContain('BEGIN RSA PRIVATE KEY');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid AES decryption', () => {
      const invalidEncryptedData = 'invalid_encrypted_data';
      const key = service.generateAESKey();

      expect(() => {
        service.decryptAES(invalidEncryptedData, key);
      }).toThrow();
    });

    it('should throw error for invalid RSA decryption', () => {
      const invalidEncryptedData = 'invalid_encrypted_data';

      expect(() => {
        service.decryptRSA(invalidEncryptedData);
      }).toThrow('RSA decryption failed');
    });
  });
});
