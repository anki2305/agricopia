import asyncHandler from '../middleware/asyncHandler.js';
import Fertilizer from '../models/fertilizerModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Fertilizer.countDocuments({ ...keyword });
  const fertilizers = await Fertilizer.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ fertilizers, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const fertilizer = await Fertilizer.findById(req.params.id);
  if (fertilizer) {
    return res.json(fertilizer);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('Fertilizer not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const fertilizer = new Fertilizer({
    name: 'Sample name',
    user: req.user._id,
    image: '/images/sample.jpg',
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await fertilizer.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, image} =
    req.body;

  const fertilizer = await Fertilizer.findById(req.params.id);

  if (fertilizer) {
    fertilizer.name = name;
    fertilizer.description = description;
    fertilizer.image = image;

    const updatedProduct = await fertilizer.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const fertilizer = await Fertilizer.findById(req.params.id);

  if (fertilizer) {
    await Fertilizer.deleteOne({ _id: fertilizer._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const fertilizer = await Fertilizer.findById(req.params.id);

  if (product) {
    const alreadyReviewed = fertilizer.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    fertilizer.reviews.push(review);

    fertilizer.numReviews = product.reviews.length;

    fertilizer.rating =
    fertilizer.reviews.reduce((acc, item) => item.rating + acc, 0) /
    fertilizer.reviews.length;

    await fertilizer.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const fertilizer = await Fertilizer.find({}).sort({ rating: -1 }).limit(3);

  res.json(fertilizer);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
