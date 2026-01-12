const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { reviewValidators } = require('../utils/validators');

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Tüm yorumları listele
 *     tags: [Reviews]
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
 *                   product_id: { type: integer }
 *                   rating: { type: integer }
 *                   comment: { type: string }
 */
router.get('/', ReviewController.getAllReviews);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Ürüne göre yorumları listele
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
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
 *                   product_id: { type: integer }
 *                   rating: { type: integer }
 *                   comment: { type: string }
 *       404:
 *         description: Ürün bulunamadı
 */
router.get('/product/:productId', ReviewController.getReviewsByProductId);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: ID'ye göre yorum getir
 *     tags: [Reviews]
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
 *                 product_id: { type: integer }
 *                 rating: { type: integer }
 *                 comment: { type: string }
 *       404:
 *         description: Yorum bulunamadı
 */
router.get('/:id', ReviewController.getReviewById);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Yeni yorum oluştur
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, product_id, rating]
 *             properties:
 *               user_id: { type: integer, minimum: 1 }
 *               product_id: { type: integer, minimum: 1 }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string, maxLength: 1000 }
 *     responses:
 *       201:
 *         description: Yorum oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 user_id: { type: integer }
 *                 product_id: { type: integer }
 *                 rating: { type: integer }
 *                 comment: { type: string }
 *       400:
 *         description: Geçersiz veri
 */
router.post('/', reviewValidators.create, ReviewController.createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     summary: Yorum güncelle
 *     tags: [Reviews]
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
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
 *                 product_id: { type: integer }
 *                 rating: { type: integer }
 *                 comment: { type: string }
 *       404:
 *         description: Yorum bulunamadı
 */
router.patch('/:id', reviewValidators.update, ReviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Yorum sil
 *     tags: [Reviews]
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
 *         description: Yorum bulunamadı
 */
router.delete('/:id', ReviewController.deleteReview);

module.exports = router;
