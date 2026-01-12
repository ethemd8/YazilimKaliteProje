const ReviewService = require('../../../src/services/reviewService');
const Review = require('../../../src/models/Review');
const Product = require('../../../src/models/Product');
const User = require('../../../src/models/User');

jest.mock('../../../src/models/Review');
jest.mock('../../../src/models/Product');
jest.mock('../../../src/models/User');

describe('ReviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('should create review when user and product exist', async () => {
      const reviewData = {
        user_id: 1,
        product_id: 1,
        rating: 5,
        comment: 'Great!',
      };
      User.findById.mockResolvedValue({ id: 1 });
      Product.findById.mockResolvedValue({ id: 1 });
      Review.findByProductId.mockResolvedValue([]);
      Review.create.mockResolvedValue({ id: 1, ...reviewData });

      const result = await ReviewService.createReview(reviewData);

      expect(result).toEqual({ id: 1, ...reviewData });
      expect(User.findById).toHaveBeenCalledWith(1);
      expect(Product.findById).toHaveBeenCalledWith(1);
      expect(Review.findByProductId).toHaveBeenCalledWith(1);
      expect(Review.create).toHaveBeenCalledWith(reviewData);
    });

    it('should create review when existingReviews is null', async () => {
      const reviewData = {
        user_id: 1,
        product_id: 1,
        rating: 5,
      };
      User.findById.mockResolvedValue({ id: 1 });
      Product.findById.mockResolvedValue({ id: 1 });
      Review.findByProductId.mockResolvedValue(null);
      Review.create.mockResolvedValue({ id: 1, ...reviewData });

      const result = await ReviewService.createReview(reviewData);

      expect(result).toEqual({ id: 1, ...reviewData });
    });

    it('should throw error when user not found', async () => {
      const reviewData = {
        user_id: 999,
        product_id: 1,
        rating: 5,
      };
      User.findById.mockResolvedValue(null);

      await expect(ReviewService.createReview(reviewData)).rejects.toThrow('Kullanıcı bulunamadı');
    });
  });
});
