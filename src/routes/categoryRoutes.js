const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { categoryValidators } = require('../utils/validators');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Tüm kategorileri listele
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/', CategoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: ID'ye göre kategori getir
 *     tags: [Categories]
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
 *         description: Kategori bulunamadı
 */
router.get('/:id', CategoryController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Yeni kategori oluştur
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 100 }
 *               description: { type: string, maxLength: 500 }
 *     responses:
 *       201:
 *         description: Kategori oluşturuldu
 */
router.post('/', categoryValidators.create, CategoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Kategori güncelle
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.patch('/:id', categoryValidators.update, CategoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Kategori sil
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;
