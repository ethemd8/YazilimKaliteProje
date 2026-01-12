const ReviewService = require('../services/reviewService');

class ReviewController {
  static async getAllReviews(req, res) {
    try {
      const reviews = await ReviewService.getAllReviews();
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getReviewById(req, res) {
    try {
      const review = await ReviewService.getReviewById(req.params.id);
      res.status(200).json(review);
    } catch (error) {
      if (error.message === 'Yorum bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async getReviewsByProductId(req, res) {
    try {
      const reviews = await ReviewService.getReviewsByProductId(req.params.productId);
      res.status(200).json(reviews);
    } catch (error) {
      if (error.message === 'Ürün bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async createReview(req, res) {
    try {
      const review = await ReviewService.createReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      if (error.message.includes('bulunamadı') || error.message.includes('zaten yorum')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async updateReview(req, res) {
    try {
      const review = await ReviewService.updateReview(req.params.id, req.body);
      res.status(200).json(review);
    } catch (error) {
      if (error.message === 'Yorum bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async deleteReview(req, res) {
    try {
      await ReviewService.deleteReview(req.params.id);
      res.status(200).json({ message: 'Yorum başarıyla silindi' });
    } catch (error) {
      if (error.message === 'Yorum bulunamadı') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = ReviewController;
