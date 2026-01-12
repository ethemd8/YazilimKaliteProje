const Category = require('../models/Category');

class CategoryService {
  static async getAllCategories() {
    return await Category.findAll();
  }

  static async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Kategori bulunamadı');
    }
    return category;
  }

  static async createCategory(categoryData) {
    // Kategori adı kontrolü
    const existingCategory = await Category.findByName(categoryData.name);
    if (existingCategory) {
      throw new Error('Bu kategori adı zaten kullanılıyor');
    }
    return await Category.create(categoryData);
  }

  static async updateCategory(id, categoryData) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Kategori bulunamadı');
    }

    // Kategori adı kontrolü
    if (categoryData.name && categoryData.name !== category.name) {
      const existingCategory = await Category.findByName(categoryData.name);
      if (existingCategory) {
        throw new Error('Bu kategori adı zaten kullanılıyor');
      }
    }

    return await Category.update(id, categoryData);
  }

  static async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Kategori bulunamadı');
    }
    return await Category.delete(id);
  }
}

module.exports = CategoryService;
