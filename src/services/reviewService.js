const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');

class ReviewService {
  static async getAllReviews() {
    return await Review.findAll();
  }

  static async getReviewById(id) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Yorum bulunamadı');
    }
    return review;
  }

  static async getReviewsByProductId(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Ürün bulunamadı');
    }
    return await Review.findByProductId(productId);
  }

  static async getReviewsByUserId(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    return await Review.findByUserId(userId);
  }

  static async createReview(reviewData) {
    const { user_id, product_id } = reviewData;

    // Kullanıcı kontrolü
    const user = await User.findById(user_id);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Ürün kontrolü
    const product = await Product.findById(product_id);
    if (!product) {
      throw new Error('Ürün bulunamadı');
    }

    // Aynı kullanıcının aynı ürüne yorum yapıp yapmadığını kontrol et
    const existingReviews = await Review.findByProductId(product_id);
    if (existingReviews && Array.isArray(existingReviews)) {
      const userReview = existingReviews.find(r => r.user_id === user_id);
      if (userReview) {
        throw new Error('Bu ürüne zaten yorum yaptınız');
      }
    }

    return await Review.create(reviewData);
  }

  static async updateReview(id, reviewData) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Yorum bulunamadı');
    }
    return await Review.update(id, reviewData);
  }

  static async deleteReview(id) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Yorum bulunamadı');
    }
    return await Review.delete(id);
  }
}

module.exports = ReviewService;
