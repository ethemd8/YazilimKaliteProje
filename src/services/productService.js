const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductService {
  static async getAllProducts() {
    return await Product.findAll();
  }

  static async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Ürün bulunamadı');
    }
    return product;
  }

  static async getProductsByCategory(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Kategori bulunamadı');
    }
    return await Product.findByCategory(categoryId);
  }

  static async createProduct(productData) {
    // Kategori kontrolü
    if (productData.category_id) {
      const category = await Category.findById(productData.category_id);
      if (!category) {
        throw new Error('Kategori bulunamadı');
      }
    }
    return await Product.create(productData);
  }

  static async updateProduct(id, productData) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Ürün bulunamadı');
    }

    // Kategori kontrolü
    if (productData.category_id) {
      const category = await Category.findById(productData.category_id);
      if (!category) {
        throw new Error('Kategori bulunamadı');
      }
    }

    return await Product.update(id, productData);
  }

  static async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Ürün bulunamadı');
    }
    return await Product.delete(id);
  }

  static async updateStock(id, quantity) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Ürün bulunamadı');
    }
    if (product.stock < quantity) {
      throw new Error('Yetersiz stok');
    }
    return await Product.updateStock(id, quantity);
  }
}

module.exports = ProductService;
