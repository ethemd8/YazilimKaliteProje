const User = require('../models/User');

class UserService {
  static async getAllUsers() {
    return await User.findAll();
  }

  static async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    return user;
  }

  static async createUser(userData) {
    // Email kontrolü
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Bu email adresi zaten kullanılıyor');
    }
    return await User.create(userData);
  }

  static async updateUser(id, userData) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Email değişikliği kontrolü
    if (userData.email && userData.email !== user.email) {
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Bu email adresi zaten kullanılıyor');
      }
    }

    return await User.update(id, userData);
  }

  static async deleteUser(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    return await User.delete(id);
  }
}

module.exports = UserService;
