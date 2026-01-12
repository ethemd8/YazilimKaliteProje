const OrderController = require('../../../src/controllers/orderController');
const OrderService = require('../../../src/services/orderService');

jest.mock('../../../src/services/orderService');

describe('OrderController', () => {
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

  describe('createOrder', () => {
    it('should create order with 201 status', async () => {
      mockReq.body = {
        user_id: 1,
        items: [{ product_id: 1, quantity: 2 }],
      };
      const mockOrder = { id: 1, user_id: 1, items: mockReq.body.items };
      OrderService.createOrder.mockResolvedValue(mockOrder);

      await OrderController.createOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 400 when product not found', async () => {
      mockReq.body = {
        user_id: 1,
        items: [{ product_id: 999, quantity: 1 }],
      };
      OrderService.createOrder.mockRejectedValue(new Error('Ürün bulunamadı: 999'));

      await OrderController.createOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 500 on generic error', async () => {
      mockReq.body = {
        user_id: 1,
        items: [{ product_id: 1, quantity: 2 }],
      };
      OrderService.createOrder.mockRejectedValue(new Error('Database error'));

      await OrderController.createOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders with 200 status', async () => {
      const mockOrders = [{ id: 1 }];
      OrderService.getAllOrders.mockResolvedValue(mockOrders);

      await OrderController.getAllOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrders);
    });

    it('should return 500 on generic error', async () => {
      OrderService.getAllOrders.mockRejectedValue(new Error('Database error'));

      await OrderController.getAllOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getOrderById', () => {
    it('should return order with 200 status', async () => {
      mockReq.params.id = '1';
      const mockOrder = { id: 1, user_id: 1, items: [] };
      OrderService.getOrderById.mockResolvedValue(mockOrder);

      await OrderController.getOrderById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      OrderService.getOrderById.mockRejectedValue(new Error('Database error'));

      await OrderController.getOrderById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getOrdersByUserId', () => {
    it('should return orders with 200 status', async () => {
      mockReq.params.userId = '1';
      const mockOrders = [{ id: 1 }];
      OrderService.getOrdersByUserId.mockResolvedValue(mockOrders);

      await OrderController.getOrdersByUserId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrders);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.userId = '1';
      OrderService.getOrdersByUserId.mockRejectedValue(new Error('Database error'));

      await OrderController.getOrdersByUserId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateOrder', () => {
    it('should update order with 200 status', async () => {
      mockReq.params.id = '1';
      mockReq.body = { status: 'shipped' };
      const mockOrder = { id: 1, status: 'shipped' };
      OrderService.updateOrder.mockResolvedValue(mockOrder);

      await OrderController.updateOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      mockReq.body = { status: 'shipped' };
      OrderService.updateOrder.mockRejectedValue(new Error('Database error'));

      await OrderController.updateOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteOrder', () => {
    it('should delete order with 200 status', async () => {
      mockReq.params.id = '1';
      OrderService.deleteOrder.mockResolvedValue({ id: 1 });

      await OrderController.deleteOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Sipariş başarıyla silindi' });
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      OrderService.deleteOrder.mockRejectedValue(new Error('Database error'));

      await OrderController.deleteOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
