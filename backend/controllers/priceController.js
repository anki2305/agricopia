import asyncHandler from '../middleware/asyncHandler.js';
import PriceModel from '../models/priceModel.js';

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

  const count = await PriceModel.countDocuments({ ...keyword });
  const priceList = await PriceModel.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ priceList, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const priceList = await PriceModel.findById(req.params.id);
  if (priceList) {
    return res.json(priceList);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('priceList not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const priceList = new PriceModel({
    name: 'Sample name',
    user: req.user._id,
    image: '/images/sample.jpg',
    price: 0,
    description: 'Sample description',
  });

  const createdProduct = await priceList.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, image, price} =
    req.body;

  const priceList = await PriceModel.findById(req.params.id);

  if (priceList) {
    priceList.name = name;
    priceList.description = description;
    priceList.image = image;
    priceList.price = price;

    const updatedProduct = await priceList.save();
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
  const priceList = await PriceModel.findById(req.params.id);

  if (priceList) {
    await PriceModel.deleteOne({ _id: priceList._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});



export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
