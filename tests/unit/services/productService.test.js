const ProductService = require('../../../src/services/productService');
const Product = require('../../../src/models/Product');
const Category = require('../../../src/models/Category');

jest.mock('../../../src/models/Product');
jest.mock('../../../src/models/Category');

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('getProductById', () => {
    it('should return product when found', async () => {
      const mockProduct = { id: 1, name: 'Test' };
      Product.findById.mockResolvedValue(mockProduct);

      const result = await ProductService.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(Product.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('createProduct', () => {
    it('should create product when category exists', async () => {
      const productData = {
        name: 'Test Product',
        price: 100,
        stock: 10,
        category_id: 1,
      };
      Category.findById.mockResolvedValue({ id: 1 });
      Product.create.mockResolvedValue({ id: 1, ...productData });

      const result = await ProductService.createProduct(productData);

      expect(result).toEqual({ id: 1, ...productData });
      expect(Category.findById).toHaveBeenCalledWith(1);
      expect(Product.create).toHaveBeenCalledWith(productData);
    });

    it('should create product without category_id', async () => {
      const productData = {
        name: 'Test Product',
        price: 100,
        stock: 10,
      };
      Product.create.mockResolvedValue({ id: 1, ...productData });

      const result = await ProductService.createProduct(productData);

      expect(result).toEqual({ id: 1, ...productData });
      expect(Category.findById).not.toHaveBeenCalled();
    });

    it('should throw error when category not found', async () => {
      const productData = {
        name: 'Test Product',
        category_id: 999,
      };
      Category.findById.mockResolvedValue(null);

      await expect(ProductService.createProduct(productData)).rejects.toThrow('Kategori bulunamadı');
    });
  });

  describe('updateProduct', () => {
    it('should update product when found', async () => {
      const existingProduct = { id: 1, name: 'Product', price: 100 };
      const updateData = { name: 'Updated Product' };
      const updatedProduct = { ...existingProduct, ...updateData };

      Product.findById.mockResolvedValue(existingProduct);
      Product.update.mockResolvedValue(updatedProduct);

      const result = await ProductService.updateProduct(1, updateData);

      expect(result).toEqual(updatedProduct);
      expect(Product.findById).toHaveBeenCalledWith(1);
      expect(Product.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should update product without category_id', async () => {
      const existingProduct = { id: 1, name: 'Product', price: 100 };
      const updateData = { name: 'Updated Product' };
      const updatedProduct = { ...existingProduct, ...updateData };

      Product.findById.mockResolvedValue(existingProduct);
      Product.update.mockResolvedValue(updatedProduct);

      const result = await ProductService.updateProduct(1, updateData);

      expect(result).toEqual(updatedProduct);
      expect(Category.findById).not.toHaveBeenCalled();
    });

    it('should throw error when product not found', async () => {
      Product.findById.mockResolvedValue(null);

      await expect(ProductService.updateProduct(999, {})).rejects.toThrow('Ürün bulunamadı');
    });
  });


  describe('deleteProduct', () => {
    it('should delete product when found', async () => {
      const mockProduct = { id: 1 };
      Product.findById.mockResolvedValue(mockProduct);
      Product.delete.mockResolvedValue({ id: 1 });

      const result = await ProductService.deleteProduct(1);

      expect(result).toEqual({ id: 1 });
      expect(Product.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when product not found', async () => {
      Product.findById.mockResolvedValue(null);

      await expect(ProductService.deleteProduct(999)).rejects.toThrow('Ürün bulunamadı');
    });
  });
});
