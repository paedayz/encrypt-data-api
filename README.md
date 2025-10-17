# Encrypt API

A secure encryption/decryption API built with NestJS that provides hybrid encryption using AES and RSA algorithms. This API allows you to encrypt sensitive data using AES encryption with a randomly generated key, and then encrypt the AES key using RSA encryption for maximum security.

## Features

- 🔐 **Hybrid Encryption**: Combines AES (symmetric) and RSA (asymmetric) encryption
- 🚀 **High Performance**: Built with NestJS for optimal performance
- 📚 **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- ✅ **Input Validation**: Comprehensive request validation using class-validator
- 🧪 **Testing**: Unit and E2E tests included
- 📝 **Logging**: Detailed logging for debugging and monitoring
- 🔒 **Secure**: Uses industry-standard encryption algorithms

## Encryption Process

1. **Encryption**:
   - Generate a random AES key
   - Encrypt the payload using AES encryption
   - Encrypt the AES key using RSA public key
   - Return both encrypted data (data1: encrypted AES key, data2: encrypted payload)

2. **Decryption**:
   - Decrypt the AES key using RSA private key
   - Decrypt the payload using the decrypted AES key
   - Return the original payload

## API Endpoints

### Encrypt Data

- **POST** `/get-encrypt-data`
- **Description**: Encrypts the provided payload using hybrid encryption
- **Request Body**:
  ```json
  {
    "payload": "string" // Max 2000 characters
  }
  ```
- **Response**:
  ```json
  {
    "successful": true,
    "data": {
      "data1": "encrypted_aes_key",
      "data2": "encrypted_payload"
    }
  }
  ```

### Decrypt Data

- **POST** `/get-decrypt-data`
- **Description**: Decrypts the provided encrypted data
- **Request Body**:
  ```json
  {
    "data1": "encrypted_aes_key",
    "data2": "encrypted_payload"
  }
  ```
- **Response**:
  ```json
  {
    "successful": true,
    "data": {
      "payload": "original_message"
    }
  }
  ```

## Installation

```bash
# Install dependencies
$ yarn install
```

## Running the Application

```bash
# Development mode
$ yarn run start:dev

# Production mode
$ yarn run start:prod

# Debug mode
$ yarn run start:debug
```

## Testing

```bash
# Unit tests
$ yarn run test

# E2E tests
$ yarn run test:e2e

# Test coverage
$ yarn run test:cov
```

## API Documentation

Once the application is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:3000/api` (if Swagger is configured)
- **JSON Schema**: `http://localhost:3000/api-json`

## Project Structure

```
src/
├── dto/                    # Data Transfer Objects
│   ├── api-response.dto.ts
│   ├── encrypt-request.dto.ts
│   ├── decrypt-request.dto.ts
│   └── index.ts
├── encryption/             # Encryption module
│   ├── encryption.controller.ts
│   ├── encryption.service.ts
│   └── encryption.service.spec.ts
├── app.controller.ts       # Main app controller
├── app.service.ts         # Main app service
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## Dependencies

### Core Dependencies

- **@nestjs/common**: NestJS core functionality
- **@nestjs/core**: NestJS framework core
- **@nestjs/platform-express**: Express platform for NestJS
- **@nestjs/swagger**: API documentation generation

### Encryption Libraries

- **crypto-js**: AES encryption/decryption
- **node-rsa**: RSA encryption/decryption

### Validation & Transformation

- **class-validator**: Request validation
- **class-transformer**: Data transformation

## Security Considerations

- RSA keys are generated with 2048-bit key length
- AES keys are 256-bit (32 bytes)
- Input validation prevents injection attacks
- Comprehensive error handling without exposing sensitive information
- Logging for security monitoring

## Error Handling

The API returns standardized error responses:

```json
{
  "successful": false,
  "error_code": "ERROR_TYPE",
  "data": null
}
```

Common error codes:

- `VALIDATION_ERROR`: Input validation failed
- `ENCRYPTION_ERROR`: Encryption process failed
- `DECRYPTION_ERROR`: Decryption process failed

## Development

### Code Style

```bash
# Format code
$ yarn run format

# Lint code
$ yarn run lint
```

### Building

```bash
# Build for production
$ yarn run build
```

## Example Usage

### Using curl

**Encrypt data:**

```bash
curl -X POST http://localhost:3000/get-encrypt-data \
  -H "Content-Type: application/json" \
  -d '{"payload": "Hello, this is a secret message"}'
```

**Decrypt data:**

```bash
curl -X POST http://localhost:3000/get-decrypt-data \
  -H "Content-Type: application/json" \
  -d '{
    "data1": "encrypted_aes_key_from_previous_response",
    "data2": "encrypted_payload_from_previous_response"
  }'
```

### Using JavaScript/TypeScript

```typescript
// Encrypt data
const encryptResponse = await fetch('http://localhost:3000/get-encrypt-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    payload: 'Hello, this is a secret message',
  }),
});

const encryptedData = await encryptResponse.json();
console.log('Encrypted:', encryptedData.data);

// Decrypt data
const decryptResponse = await fetch('http://localhost:3000/get-decrypt-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    data1: encryptedData.data.data1,
    data2: encryptedData.data.data2,
  }),
});

const decryptedData = await decryptResponse.json();
console.log('Decrypted:', decryptedData.data.payload);
```

## License

This project is licensed under the UNLICENSED License.
