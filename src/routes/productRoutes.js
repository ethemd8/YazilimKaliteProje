const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { productValidators } = require('../utils/validators');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tüm ürünleri listele
 *     tags: [Products]
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
 *                   name: { type: string }
 *                   description: { type: string }
 *                   price: { type: number }
 *                   stock: { type: integer }
 *                   category_id: { type: integer }
 *                   category_name: { type: string }
 *                   image_url: { type: string }
 */
router.get('/', ProductController.getAllProducts);

/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Kategoriye göre ürünleri listele
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
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
 *                   name: { type: string }
 *                   description: { type: string }
 *                   price: { type: number }
 *                   stock: { type: integer }
 *                   category_id: { type: integer }
 *       404:
 *         description: Kategori bulunamadı
 */
router.get('/category/:categoryId', ProductController.getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: ID'ye göre ürün getir
 *     tags: [Products]
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
 *                 name: { type: string }
 *                 description: { type: string }
 *                 price: { type: number }
 *                 stock: { type: integer }
 *                 category_id: { type: integer }
 *                 category_name: { type: string }
 *                 image_url: { type: string }
 *       404:
 *         description: Ürün bulunamadı
 */
router.get('/:id', ProductController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yeni ürün oluştur
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 200 }
 *               description: { type: string, maxLength: 1000 }
 *               price: { type: number, minimum: 0 }
 *               stock: { type: integer, minimum: 0 }
 *               category_id: { type: integer, minimum: 1 }
 *               image_url: { type: string }
 *     responses:
 *       201:
 *         description: Ürün oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 name: { type: string }
 *                 description: { type: string }
 *                 price: { type: number }
 *                 stock: { type: integer }
 *                 category_id: { type: integer }
 *       400:
 *         description: Geçersiz veri
 */
router.post('/', productValidators.create, ProductController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Ürün güncelle
 *     tags: [Products]
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
 *               name: { type: string, minLength: 2, maxLength: 200 }
 *               description: { type: string, maxLength: 1000 }
 *               price: { type: number, minimum: 0 }
 *               stock: { type: integer, minimum: 0 }
 *               category_id: { type: integer, minimum: 1 }
 *               image_url: { type: string }
 *     responses:
 *       200:
 *         description: Başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 name: { type: string }
 *                 description: { type: string }
 *                 price: { type: number }
 *                 stock: { type: integer }
 *       404:
 *         description: Ürün bulunamadı
 */
router.patch('/:id', productValidators.update, ProductController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Ürün sil
 *     tags: [Products]
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
 *         description: Ürün bulunamadı
 */
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
