const ReviewController = require('../../../src/controllers/reviewController');
const ReviewService = require('../../../src/services/reviewService');

jest.mock('../../../src/services/reviewService');

describe('ReviewController', () => {
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

  describe('getAllReviews', () => {
    it('should return all reviews with 200 status', async () => {
      const mockReviews = [{ id: 1, rating: 5 }];
      ReviewService.getAllReviews.mockResolvedValue(mockReviews);

      await ReviewController.getAllReviews(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should return 500 on generic error', async () => {
      ReviewService.getAllReviews.mockRejectedValue(new Error('Database error'));

      await ReviewController.getAllReviews(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getReviewById', () => {
    it('should return review with 200 status', async () => {
      mockReq.params.id = '1';
      const mockReview = { id: 1, rating: 5 };
      ReviewService.getReviewById.mockResolvedValue(mockReview);

      await ReviewController.getReviewById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReview);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      ReviewService.getReviewById.mockRejectedValue(new Error('Database error'));

      await ReviewController.getReviewById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getReviewsByProductId', () => {
    it('should return reviews with 200 status', async () => {
      mockReq.params.productId = '1';
      const mockReviews = [{ id: 1, rating: 5 }];
      ReviewService.getReviewsByProductId.mockResolvedValue(mockReviews);

      await ReviewController.getReviewsByProductId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.productId = '1';
      ReviewService.getReviewsByProductId.mockRejectedValue(new Error('Database error'));

      await ReviewController.getReviewsByProductId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createReview', () => {
    it('should create review with 201 status', async () => {
      mockReq.body = { user_id: 1, product_id: 1, rating: 5, comment: 'Great!' };
      const mockReview = { id: 1, ...mockReq.body };
      ReviewService.createReview.mockResolvedValue(mockReview);

      await ReviewController.createReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockReview);
    });

    it('should return 500 on generic error', async () => {
      mockReq.body = { user_id: 1, product_id: 1, rating: 5 };
      ReviewService.createReview.mockRejectedValue(new Error('Database error'));

      await ReviewController.createReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateReview', () => {
    it('should update review with 200 status', async () => {
      mockReq.params.id = '1';
      mockReq.body = { rating: 4 };
      const mockReview = { id: 1, rating: 4 };
      ReviewService.updateReview.mockResolvedValue(mockReview);

      await ReviewController.updateReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReview);
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      mockReq.body = { rating: 4 };
      ReviewService.updateReview.mockRejectedValue(new Error('Database error'));

      await ReviewController.updateReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteReview', () => {
    it('should delete review with 200 status', async () => {
      mockReq.params.id = '1';
      ReviewService.deleteReview.mockResolvedValue();

      await ReviewController.deleteReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Yorum başarıyla silindi' });
    });

    it('should return 500 on generic error', async () => {
      mockReq.params.id = '1';
      ReviewService.deleteReview.mockRejectedValue(new Error('Database error'));

      await ReviewController.deleteReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
