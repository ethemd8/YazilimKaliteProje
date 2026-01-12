const CategoryService = require('../../../src/services/categoryService');
const Category = require('../../../src/models/Category');

jest.mock('../../../src/models/Category');

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('getCategoryById', () => {
    it('should return category when found', async () => {
      const mockCategory = { id: 1, name: 'Test' };
      Category.findById.mockResolvedValue(mockCategory);

      const result = await CategoryService.getCategoryById(1);

      expect(result).toEqual(mockCategory);
      expect(Category.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when category not found', async () => {
      Category.findById.mockResolvedValue(null);

      await expect(CategoryService.getCategoryById(999)).rejects.toThrow('Kategori bulunamadı');
    });
  });

  describe('createCategory', () => {
    it('should create category when name is unique', async () => {
      const categoryData = {
        name: 'Test Category',
        description: 'Test',
      };
      Category.findByName.mockResolvedValue(null);
      Category.create.mockResolvedValue({ id: 1, ...categoryData });

      const result = await CategoryService.createCategory(categoryData);

      expect(result).toEqual({ id: 1, ...categoryData });
      expect(Category.findByName).toHaveBeenCalledWith(categoryData.name);
      expect(Category.create).toHaveBeenCalledWith(categoryData);
    });

    it('should throw error when category name already exists', async () => {
      const categoryData = {
        name: 'Existing Category',
        description: 'Test',
      };
      Category.findByName.mockResolvedValue({ id: 1, name: 'Existing Category' });

      await expect(CategoryService.createCategory(categoryData)).rejects.toThrow('Bu kategori adı zaten kullanılıyor');
    });
  });

  describe('updateCategory', () => {
    it('should update category when found', async () => {
      const existingCategory = { id: 1, name: 'Test' };
      const updateData = { name: 'Updated' };
      Category.findById.mockResolvedValue(existingCategory);
      Category.findByName.mockResolvedValue(null);
      Category.update.mockResolvedValue({ ...existingCategory, ...updateData });

      const result = await CategoryService.updateCategory(1, updateData);

      expect(result).toEqual({ ...existingCategory, ...updateData });
      expect(Category.findById).toHaveBeenCalledWith(1);
    });

    it('should update category without name change', async () => {
      const existingCategory = { id: 1, name: 'Test' };
      const updateData = { description: 'Updated description' };
      Category.findById.mockResolvedValue(existingCategory);
      Category.update.mockResolvedValue({ ...existingCategory, ...updateData });

      const result = await CategoryService.updateCategory(1, updateData);

      expect(result).toEqual({ ...existingCategory, ...updateData });
      expect(Category.findByName).not.toHaveBeenCalled();
    });

    it('should throw error when category not found', async () => {
      Category.findById.mockResolvedValue(null);

      await expect(CategoryService.updateCategory(999, {})).rejects.toThrow('Kategori bulunamadı');
    });
  });

  describe('deleteCategory', () => {
    it('should delete category when found', async () => {
      const mockCategory = { id: 1 };
      Category.findById.mockResolvedValue(mockCategory);
      Category.delete.mockResolvedValue({ id: 1 });

      const result = await CategoryService.deleteCategory(1);

      expect(result).toEqual({ id: 1 });
      expect(Category.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when category not found', async () => {
      Category.findById.mockResolvedValue(null);

      await expect(CategoryService.deleteCategory(999)).rejects.toThrow('Kategori bulunamadı');
    });
  });
});
