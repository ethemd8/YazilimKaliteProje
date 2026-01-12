const CategoryController = require('../../../src/controllers/categoryController');
const CategoryService = require('../../../src/services/categoryService');

jest.mock('../../../src/services/categoryService');

describe('CategoryController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: {},
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getAllCategories', () => {
    it('should return all categories with 200 status', async () => {
      const mockCategories = [{ id: 1, name: 'Test' }];
      CategoryService.getAllCategories.mockResolvedValue(mockCategories);

      await CategoryController.getAllCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCategories);
    });

    it('should return 500 on generic error', async () => {
      CategoryService.getAllCategories.mockRejectedValue(new Error('Database error'));

      await CategoryController.getAllCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getCategoryById', () => {
    it('should return category with 200 status', async () => {
      mockReq.params.id = '1';
      const mockCategory = { id: 1, name: 'Test' };
      CategoryService.getCategoryById.mockResolvedValue(mockCategory);

      await CategoryController.getCategoryById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      CategoryService.getCategoryById.mockRejectedValue(new Error('Database error'));

      await CategoryController.getCategoryById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createCategory', () => {
    it('should create category with 201 status', async () => {
      mockReq.body = { name: 'Test Category', description: 'Test' };
      const mockCategory = { id: 1, ...mockReq.body };
      CategoryService.createCategory.mockResolvedValue(mockCategory);

      await CategoryController.createCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 500 on generic error', async () => {
      mockReq.body = { name: 'Test Category' };
      CategoryService.createCategory.mockRejectedValue(new Error('Database error'));

      await CategoryController.createCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateCategory', () => {
    it('should update category with 200 status', async () => {
      mockReq.params.id = '1';
      mockReq.body = { name: 'Updated Category' };
      const mockCategory = { id: 1, name: 'Updated Category' };
      CategoryService.updateCategory.mockResolvedValue(mockCategory);

      await CategoryController.updateCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      mockReq.body = { name: 'Updated' };
      CategoryService.updateCategory.mockRejectedValue(new Error('Database error'));

      await CategoryController.updateCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteCategory', () => {
    it('should delete category with 200 status', async () => {
      mockReq.params.id = '1';
      CategoryService.deleteCategory.mockResolvedValue();

      await CategoryController.deleteCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Kategori başarıyla silindi' });
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      CategoryService.deleteCategory.mockRejectedValue(new Error('Database error'));

      await CategoryController.deleteCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
