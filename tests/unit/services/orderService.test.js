const OrderService = require('../../../src/services/orderService');
const Order = require('../../../src/models/Order');
const Product = require('../../../src/models/Product');
const OrderItem = require('../../../src/models/OrderItem');
const User = require('../../../src/models/User');

jest.mock('../../../src/models/Order');
jest.mock('../../../src/models/Product');
jest.mock('../../../src/models/OrderItem');
jest.mock('../../../src/models/User');

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order with items when stock is sufficient', async () => {
      const orderData = {
        user_id: 1,
        items: [{ product_id: 1, quantity: 2 }],
      };
      const mockProduct = { id: 1, price: 100, stock: 10, name: 'Test Product' };
      const mockOrder = { id: 1, user_id: 1, total_amount: 200 };
      const mockItems = [{ id: 1 }];

      User.findById.mockResolvedValue({ id: 1 });
      Product.findById
        .mockResolvedValueOnce(mockProduct) // İlk çağrı - stok kontrolü için
        .mockResolvedValueOnce(mockProduct); // İkinci çağrı - sipariş kalemi için
      Order.create.mockResolvedValue(mockOrder);
      Order.getOrderItems.mockResolvedValue(mockItems);
      OrderItem.create.mockResolvedValue({ id: 1 });
      
      // Product.updateStock mock'u - Product model mock'u içinde
      const ProductModel = require('../../../src/models/Product');
      jest.spyOn(ProductModel, 'updateStock').mockResolvedValue({ id: 1, stock: 8 });

      const result = await OrderService.createOrder(orderData);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('items');
      expect(User.findById).toHaveBeenCalledWith(1);
      expect(Product.findById).toHaveBeenCalledWith(1);
      expect(Order.create).toHaveBeenCalled();
    });
  });

  describe('getOrderById', () => {
    it('should return order with items when found', async () => {
      const mockOrder = { id: 1, user_id: 1, total_amount: 200 };
      const mockItems = [{ id: 1, product_id: 1, quantity: 2 }];

      Order.findById.mockResolvedValue(mockOrder);
      Order.getOrderItems.mockResolvedValue(mockItems);

      const result = await OrderService.getOrderById(1);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('items');
      expect(Order.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when order not found', async () => {
      Order.findById.mockResolvedValue(null);

      await expect(OrderService.getOrderById(999)).rejects.toThrow('Sipariş bulunamadı');
    });
  });

  describe('updateOrder', () => {
    it('should update order when found', async () => {
      const existingOrder = { id: 1 };
      const updateData = { status: 'shipped' };
      Order.findById.mockResolvedValue(existingOrder);
      Order.update.mockResolvedValue({ ...existingOrder, ...updateData });

      const result = await OrderService.updateOrder(1, updateData);

      expect(result).toEqual({ ...existingOrder, ...updateData });
      expect(Order.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when order not found', async () => {
      Order.findById.mockResolvedValue(null);

      await expect(OrderService.updateOrder(999, {})).rejects.toThrow('Sipariş bulunamadı');
    });
  });

  describe('deleteOrder', () => {
    it('should delete order when found', async () => {
      const mockOrder = { id: 1 };
      Order.findById.mockResolvedValue(mockOrder);
      Order.delete.mockResolvedValue({ id: 1 });

      const result = await OrderService.deleteOrder(1);

      expect(result).toEqual({ id: 1 });
      expect(Order.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when order not found', async () => {
      Order.findById.mockResolvedValue(null);

      await expect(OrderService.deleteOrder(999)).rejects.toThrow('Sipariş bulunamadı');
    });
  });
});
