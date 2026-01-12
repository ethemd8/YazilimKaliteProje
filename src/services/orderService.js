const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');
const Product = require('../models/Product');

class OrderService {
  static async getAllOrders() {
    return await Order.findAll();
  }

  static async getOrderById(id) {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error('Sipariş bulunamadı');
    }
    const items = await Order.getOrderItems(id);
    return { ...order, items };
  }

  static async getOrdersByUserId(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    return await Order.findByUserId(userId);
  }

  static async createOrder(orderData) {
    const { user_id, items, shipping_address } = orderData;

    // Kullanıcı kontrolü
    const user = await User.findById(user_id);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Toplam tutarı hesapla ve stok kontrolü yap
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        throw new Error(`Ürün bulunamadı: ${item.product_id}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Yetersiz stok: ${product.name}`);
      }
      totalAmount += product.price * item.quantity;
    }

    // Sipariş oluştur
    const order = await Order.create({
      user_id,
      total_amount: totalAmount,
      status: 'pending',
      shipping_address,
    });

    // Sipariş kalemlerini oluştur ve stok güncelle
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      });
      await Product.updateStock(item.product_id, item.quantity);
    }

    const orderItems = await Order.getOrderItems(order.id);
    return { ...order, items: orderItems };
  }

  static async updateOrder(id, orderData) {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error('Sipariş bulunamadı');
    }
    return await Order.update(id, orderData);
  }

  static async deleteOrder(id) {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error('Sipariş bulunamadı');
    }
    return await Order.delete(id);
  }
}

module.exports = OrderService;
