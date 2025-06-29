const express = require("express");
const { getProducts, getProductById, createProduct } = require("../controllers/productController");
const Product = require("../models/product");
const router = express.Router();

//  Get all products (with filters, pagination, etc.)
router.get("/", getProducts);

//  Create a new product (via Postman or dashboard)
router.post("/", createProduct);

// Get a single product by ID
router.get("/:id", getProductById);



module.exports = router;