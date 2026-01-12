// Validators test - Validator yapılarını kontrol ediyoruz
// express-validator kütüphanesi zaten test edilmiş olduğu için
// sadece validator yapılarının doğru oluşturulduğunu kontrol ediyoruz

// Mock express-validator before requiring validators
jest.mock('express-validator', () => {
  const mockChain = {
    trim: jest.fn().mockReturnThis(),
    notEmpty: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    isEmail: jest.fn().mockReturnThis(),
    isFloat: jest.fn().mockReturnThis(),
    isInt: jest.fn().mockReturnThis(),
    isURL: jest.fn().mockReturnThis(),
    isIn: jest.fn().mockReturnThis(),
    isArray: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
  };

  return {
    body: jest.fn(() => mockChain),
    validationResult: jest.fn(() => ({
      isEmpty: () => true,
      array: () => [],
    })),
  };
});

const {
  handleValidationErrors,
} = require('../../../src/utils/validators');
const { validationResult } = require('express-validator');

describe('Validators', () => {
  describe('handleValidationErrors', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next when no validation errors', () => {
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      validationResult.mockReturnValue({ isEmpty: () => true });

      handleValidationErrors(mockReq, mockRes, mockNext);

      expect(validationResult).toHaveBeenCalledWith(mockReq);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 when validation errors exist', () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      const mockErrors = [{ msg: 'Validation error', param: 'field' }];
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      handleValidationErrors(mockReq, mockRes, mockNext);

      expect(validationResult).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ errors: mockErrors });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
