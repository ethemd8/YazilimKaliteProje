const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { orderValidators } = require('../utils/validators');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Tüm siparişleri listele
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   user_id: { type: integer }
 *                   total_amount: { type: number }
 *                   status: { type: string }
 *                   items: { type: array }
 */
router.get('/', OrderController.getAllOrders);

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Kullanıcıya göre siparişleri listele
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   user_id: { type: integer }
 *                   total_amount: { type: number }
 *                   status: { type: string }
 *                   items: { type: array }
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.get('/user/:userId', OrderController.getOrdersByUserId);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: ID'ye göre sipariş getir
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 user_id: { type: integer }
 *                 total_amount: { type: number }
 *                 status: { type: string }
 *                 shipping_address: { type: string }
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       product_id: { type: integer }
 *                       quantity: { type: integer }
 *                       price: { type: number }
 *       404:
 *         description: Sipariş bulunamadı
 */
router.get('/:id', OrderController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Yeni sipariş oluştur
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, items]
 *             properties:
 *               user_id: { type: integer, minimum: 1 }
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [product_id, quantity]
 *                   properties:
 *                     product_id: { type: integer, minimum: 1 }
 *                     quantity: { type: integer, minimum: 1 }
 *               status: { type: string, enum: [pending, processing, shipped, delivered, cancelled] }
 *               shipping_address: { type: string, maxLength: 500 }
 *     responses:
 *       201:
 *         description: Sipariş oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 user_id: { type: integer }
 *                 total_amount: { type: number }
 *                 status: { type: string }
 *                 items: { type: array }
 *       400:
 *         description: Geçersiz veri
 */
router.post('/', orderValidators.create, OrderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     summary: Sipariş güncelle
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *               shipping_address:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 user_id: { type: integer }
 *                 total_amount: { type: number }
 *                 status: { type: string }
 *                 shipping_address: { type: string }
 *                 items: { type: array }
 *       404:
 *         description: Sipariş bulunamadı
 */
router.patch('/:id', orderValidators.update, OrderController.updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Sipariş sil
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başarılı
 *       404:
 *         description: Sipariş bulunamadı
 */
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
