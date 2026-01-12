const OrderService = require('../services/orderService');

class OrderController {
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrderById(req, res) {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      res.status(200).json(order);
    } catch (error) {
      if (error.message === 'Sipariş bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async getOrdersByUserId(req, res) {
    try {
      const orders = await OrderService.getOrdersByUserId(req.params.userId);
      res.status(200).json(orders);
    } catch (error) {
      if (error.message === 'Kullanıcı bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async createOrder(req, res) {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      if (error.message.includes('bulunamadı') || error.message.includes('Yetersiz stok')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async updateOrder(req, res) {
    try {
      const order = await OrderService.updateOrder(req.params.id, req.body);
      res.status(200).json(order);
    } catch (error) {
      if (error.message === 'Sipariş bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async deleteOrder(req, res) {
    try {
      await OrderService.deleteOrder(req.params.id);
      res.status(200).json({ message: 'Sipariş başarıyla silindi' });
    } catch (error) {
      if (error.message === 'Sipariş bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = OrderController;
