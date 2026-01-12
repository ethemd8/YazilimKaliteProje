const ProductController = require('../../../src/controllers/productController');
const ProductService = require('../../../src/services/productService');

jest.mock('../../../src/services/productService');

describe('ProductController', () => {
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

  describe('createProduct', () => {
    it('should create product with 201 status', async () => {
      mockReq.body = { name: 'Test Product', price: 100, stock: 10 };
      const mockProduct = { id: 1, ...mockReq.body };
      ProductService.createProduct.mockResolvedValue(mockProduct);

      await ProductController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 500 on generic error', async () => {
      mockReq.body = { name: 'Test Product', price: 100, stock: 10 };
      ProductService.createProduct.mockRejectedValue(new Error('Database error'));

      await ProductController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products with 200 status', async () => {
      const mockProducts = [{ id: 1, name: 'Test' }];
      ProductService.getAllProducts.mockResolvedValue(mockProducts);

      await ProductController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should return 500 on generic error', async () => {
      ProductService.getAllProducts.mockRejectedValue(new Error('Database error'));

      await ProductController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProductById', () => {
    it('should return product with 200 status', async () => {
      mockReq.params.id = '1';
      const mockProduct = { id: 1, name: 'Test Product' };
      ProductService.getProductById.mockResolvedValue(mockProduct);

      await ProductController.getProductById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      ProductService.getProductById.mockRejectedValue(new Error('Database error'));

      await ProductController.getProductById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateProduct', () => {
    it('should update product with 200 status', async () => {
      mockReq.params.id = '1';
      mockReq.body = { name: 'Updated' };
      const mockProduct = { id: 1, name: 'Updated' };
      ProductService.updateProduct.mockResolvedValue(mockProduct);

      await ProductController.updateProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      mockReq.body = { name: 'Updated' };
      ProductService.updateProduct.mockRejectedValue(new Error('Database error'));

      await ProductController.updateProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category with 200 status', async () => {
      mockReq.params.categoryId = '1';
      const mockProducts = [{ id: 1 }];
      ProductService.getProductsByCategory.mockResolvedValue(mockProducts);

      await ProductController.getProductsByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.categoryId = '1';
      ProductService.getProductsByCategory.mockRejectedValue(new Error('Database error'));

      await ProductController.getProductsByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product with 200 status', async () => {
      mockReq.params.id = '1';
      ProductService.deleteProduct.mockResolvedValue({ id: 1 });

      await ProductController.deleteProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Ürün başarıyla silindi' });
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      ProductService.deleteProduct.mockRejectedValue(new Error('Database error'));

      await ProductController.deleteProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
