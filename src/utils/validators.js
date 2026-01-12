const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const userValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('İsim gereklidir').isLength({ min: 2, max: 100 }),
    body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
    body('phone').optional().isLength({ max: 20 }),
    body('address').optional().isLength({ max: 500 }),
    handleValidationErrors,
  ],
  update: [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail(),
    body('phone').optional().isLength({ max: 20 }),
    body('address').optional().isLength({ max: 500 }),
    handleValidationErrors,
  ],
};

const categoryValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('Kategori adı gereklidir').isLength({ min: 2, max: 100 }),
    body('description').optional().isLength({ max: 500 }),
    handleValidationErrors,
  ],
  update: [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('description').optional().isLength({ max: 500 }),
    handleValidationErrors,
  ],
};

const productValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('Ürün adı gereklidir').isLength({ min: 2, max: 200 }),
    body('description').optional().isLength({ max: 1000 }),
    body('price').isFloat({ min: 0 }).withMessage('Fiyat 0 veya daha büyük olmalıdır'),
    body('stock').isInt({ min: 0 }).withMessage('Stok 0 veya daha büyük bir tam sayı olmalıdır'),
    body('category_id').optional().isInt({ min: 1 }),
    body('image_url').optional().isURL().withMessage('Geçerli bir URL giriniz'),
    handleValidationErrors,
  ],
  update: [
    body('name').optional().trim().isLength({ min: 2, max: 200 }),
    body('description').optional().isLength({ max: 1000 }),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('category_id').optional().isInt({ min: 1 }),
    body('image_url').optional().isURL(),
    handleValidationErrors,
  ],
};

const orderValidators = {
  create: [
    body('user_id').isInt({ min: 1 }).withMessage('Geçerli bir kullanıcı ID giriniz'),
    body('items').isArray({ min: 1 }).withMessage('En az bir ürün seçilmelidir'),
    body('items.*.product_id').isInt({ min: 1 }).withMessage('Geçerli bir ürün ID giriniz'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Miktar 1 veya daha büyük olmalıdır'),
    body('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    body('shipping_address').optional().isLength({ max: 500 }),
    handleValidationErrors,
  ],
  update: [
    body('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    body('shipping_address').optional().isLength({ max: 500 }),
    handleValidationErrors,
  ],
};

const reviewValidators = {
  create: [
    body('user_id').isInt({ min: 1 }).withMessage('Geçerli bir kullanıcı ID giriniz'),
    body('product_id').isInt({ min: 1 }).withMessage('Geçerli bir ürün ID giriniz'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating 1-5 arasında olmalıdır'),
    body('comment').optional().isLength({ max: 1000 }),
    handleValidationErrors,
  ],
  update: [
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('comment').optional().isLength({ max: 1000 }),
    handleValidationErrors,
  ],
};

module.exports = {
  userValidators,
  categoryValidators,
  productValidators,
  orderValidators,
  reviewValidators,
  handleValidationErrors,
};
