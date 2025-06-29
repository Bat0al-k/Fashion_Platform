const Cart = require('../models/Cart');
const Product = require('../models/product');

const formatCartResponse = (cart) => {
  const items = cart.items.map(item => ({
    _id: item._id,
    id: item.product?._id || '',
    name: item.productSnapshot?.name || item.product?.title || 'Unknown',
    price: item.price,
    quantity: item.quantity,
    image: item.productSnapshot?.image || item.product?.images?.[0] || '',
    color: item.color,
    size: item.size,
    productSnapshot: item.productSnapshot || {}
  }));

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return { items, total };
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'title price images stock brand');

    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }

    cart.items = cart.items.filter(item => item.product && item.product.stock > 0);
    await cart.save();

    res.json(formatCartResponse(cart));
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{
          product: productId,
          quantity,
          price: product.price,
          productSnapshot: {
            name: product.title,
            code: product._id.toString(),
            image: product.images?.[0] || '',
            brand: product.brand
          }
        }]
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = product.price;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
          productSnapshot: {
            name: product.title,
            code: product._id.toString(),
            image: product.images?.[0] || '',
            brand: product.brand
          }
        });
      }
    }

    await cart.save();
    await cart.populate('items.product', 'title price images stock brand');

    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product', 'title price images stock brand');

    res.json(formatCartResponse(cart));
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully', items: [], total: 0 });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    cartItem.price = product.price;

    await cart.save();
    await cart.populate('items.product', 'title price images stock brand');

    res.json(formatCartResponse(cart));
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItem
};