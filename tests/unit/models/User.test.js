const User = require('../../../src/models/User');
const { query } = require('../../../src/database/db');

jest.mock('../../../src/database/db');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: 1, name: 'Ahmet', email: 'ahmet@test.com' };
      query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.findById(1);

      expect(result).toEqual(mockUser);
      expect(query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone, address, created_at, updated_at FROM users WHERE id = $1',
        [1]
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Mehmet',
        email: 'mehmet@test.com',
        password: 'password123',
        phone: '555-1234',
        address: 'İstanbul',
      };
      const mockUser = { id: 3, ...userData };
      query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.create(userData);

      expect(result).toEqual(mockUser);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [userData.name, userData.email, userData.password, userData.phone, userData.address]
      );
    });
  });

  describe('update', () => {
    it('should update user with provided fields', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUser = { id: 1, ...updateData };
      query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.update(1, updateData);

      expect(result).toEqual(mockUser);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        expect.arrayContaining([updateData.name, 1])
      );
    });

    it('should return user when no fields to update', async () => {
      const mockUser = { id: 1, name: 'Test' };
      query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.update(1, {});

      expect(result).toEqual(mockUser);
      expect(query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone, address, created_at, updated_at FROM users WHERE id = $1',
        [1]
      );
    });
  });
});
