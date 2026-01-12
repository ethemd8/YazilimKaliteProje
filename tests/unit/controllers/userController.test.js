const UserController = require('../../../src/controllers/userController');
const UserService = require('../../../src/services/userService');

jest.mock('../../../src/services/userService');

describe('UserController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: {},
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createUser', () => {
    it('should create user with 201 status', async () => {
      mockReq.body = { name: 'Test', email: 'test@test.com', password: 'password123' };
      const mockUser = { id: 1, ...mockReq.body };
      UserService.createUser.mockResolvedValue(mockUser);

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 500 on generic error', async () => {
      mockReq.body = { name: 'Test', email: 'test@test.com', password: 'password123' };
      UserService.createUser.mockRejectedValue(new Error('Database error'));

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with 200 status', async () => {
      const mockUsers = [{ id: 1, name: 'Test' }];
      UserService.getAllUsers.mockResolvedValue(mockUsers);

      await UserController.getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 500 on generic error', async () => {
      UserService.getAllUsers.mockRejectedValue(new Error('Database error'));

      await UserController.getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getUserById', () => {
    it('should return user with 200 status', async () => {
      mockReq.params.id = '1';
      const mockUser = { id: 1, name: 'Test' };
      UserService.getUserById.mockResolvedValue(mockUser);

      await UserController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      UserService.getUserById.mockRejectedValue(new Error('Database error'));

      await UserController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateUser', () => {
    it('should update user with 200 status', async () => {
      mockReq.params.id = '1';
      mockReq.body = { name: 'Updated' };
      const mockUser = { id: 1, name: 'Updated' };
      UserService.updateUser.mockResolvedValue(mockUser);

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      mockReq.body = { name: 'Updated' };
      UserService.updateUser.mockRejectedValue(new Error('Database error'));

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteUser', () => {
    it('should delete user with 200 status', async () => {
      mockReq.params.id = '1';
      UserService.deleteUser.mockResolvedValue();

      await UserController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Kullanıcı başarıyla silindi' });
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      UserService.deleteUser.mockRejectedValue(new Error('Database error'));

      await UserController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
