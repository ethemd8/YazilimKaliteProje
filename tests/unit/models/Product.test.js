const Product = require('../../../src/models/Product');
const { query } = require('../../../src/database/db');

jest.mock('../../../src/database/db');

describe('Product Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return product by id', async () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 100 };
      query.mockResolvedValue({ rows: [mockProduct] });

      const result = await Product.findById(1);

      expect(result).toEqual(mockProduct);
      expect(query).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test',
        price: 100,
        stock: 10,
        category_id: 1,
      };
      const mockProduct = { id: 1, ...productData };
      query.mockResolvedValue({ rows: [mockProduct] });

      const result = await Product.create(productData);

      expect(result).toEqual(mockProduct);
      expect(query).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update product with provided fields', async () => {
      const updateData = { name: 'Updated Product' };
      const mockProduct = { id: 1, ...updateData };
      query.mockResolvedValue({ rows: [mockProduct] });

      const result = await Product.update(1, updateData);

      expect(result).toEqual(mockProduct);
      expect(query).toHaveBeenCalled();
    });

    it('should return product when no fields to update', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };
      query.mockResolvedValueOnce({ rows: [mockProduct] });

      const result = await Product.update(1, {});

      expect(result).toEqual(mockProduct);
      expect(query).toHaveBeenCalled();
    });
  });
});
