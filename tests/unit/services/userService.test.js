const UserService = require('../../../src/services/userService');
const User = require('../../../src/models/User');

jest.mock('../../../src/models/User');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, name: 'Test' };
      User.findById.mockResolvedValue(mockUser);

      const result = await UserService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('createUser', () => {
    it('should create user when email is unique', async () => {
      const userData = {
        name: 'Mehmet',
        email: 'mehmet@test.com',
        password: 'password123',
      };
      User.findByEmail.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 3, ...userData });

      const result = await UserService.createUser(userData);

      expect(result).toEqual({ id: 3, ...userData });
      expect(User.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(User.create).toHaveBeenCalledWith(userData);
    });

    it('should throw error when email already exists', async () => {
      const userData = {
        name: 'Test',
        email: 'existing@test.com',
        password: 'password123',
      };
      User.findByEmail.mockResolvedValue({ id: 1, email: 'existing@test.com' });

      await expect(UserService.createUser(userData)).rejects.toThrow('Bu email adresi zaten kullanılıyor');
    });
  });

  describe('updateUser', () => {
    it('should update user when found', async () => {
      const existingUser = { id: 1, name: 'Ahmet', email: 'ahmet@test.com' };
      const updateData = { name: 'Ahmet Updated' };
      const updatedUser = { ...existingUser, ...updateData };

      User.findById.mockResolvedValue(existingUser);
      User.update.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser(1, updateData);

      expect(result).toEqual(updatedUser);
      expect(User.findById).toHaveBeenCalledWith(1);
      expect(User.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should update user without email change', async () => {
      const existingUser = { id: 1, name: 'Ahmet', email: 'ahmet@test.com' };
      const updateData = { name: 'Ahmet Updated', email: 'ahmet@test.com' };
      const updatedUser = { ...existingUser, ...updateData };

      User.findById.mockResolvedValue(existingUser);
      User.update.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser(1, updateData);

      expect(result).toEqual(updatedUser);
      expect(User.findByEmail).not.toHaveBeenCalled();
    });
  });


  describe('deleteUser', () => {
    it('should delete user when found', async () => {
      const mockUser = { id: 1 };
      User.findById.mockResolvedValue(mockUser);
      User.delete.mockResolvedValue({ id: 1 });

      const result = await UserService.deleteUser(1);

      expect(result).toEqual({ id: 1 });
      expect(User.findById).toHaveBeenCalledWith(1);
    });
  });
});
