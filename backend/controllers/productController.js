const Product = require("../models/product.js");

const getProducts = async (req, res) => {
  
  try {
    const {
      
      category,
      subcategory,
       size,
      minPrice,
      maxPrice,
      page = 1,
      limit = 8,
      sortBy,
    } = req.query;

   

// Build filters

     const filter = {};
  
    //  بالكاتيجورى والساب كاتيجورى فلترة 
   if (category) {
 
   filter.category = { $in: Array.isArray(category) ? category : [category] };
}

if (subcategory) {
 
  filter.subcategory = { $in: Array.isArray(subcategory) ? subcategory : [subcategory] };
}


    // فلترة بالسايز
if (size) {
  const sizesArray = Array.isArray(size) ? size : [size];
  filter.sizes = { $in: sizesArray }; 
}
  
    // فلترة بالسعر
if (minPrice !== undefined && maxPrice !== undefined) {
  filter.price = {
    $gte: Number(minPrice),
    $lte: Number(maxPrice),
  };
} else if (minPrice !== undefined) {
  filter.price = { $gte: Number(minPrice) };
} else if (maxPrice !== undefined) {
  filter.price = { $lte: Number(maxPrice) };
}
  
            //  السورتنج
    let sortOptions = {};
if (sortBy === 'priceAsc') sortOptions.price = 1;
else if (sortBy === 'priceDesc') sortOptions.price = -1;
else if (sortBy === 'rating') sortOptions.rating = -1;
else if (sortBy === 'latest') sortOptions.createdAt = -1;




    // الباجنيشن

    const parsedLimit = Number(limit);
    const parsedPage = Number(page);
    const safeLimit = parsedLimit > 0 ? parsedLimit : 8;
    const skip = (parsedPage - 1) * safeLimit;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(safeLimit)
      .sort(sortOptions)
      .lean();

       const normalizedProducts = products.map((p) => ({
      ...p,
      _id: p._id?.toString(), // تحويل _id إلى string
    }));

    const total = await Product.countDocuments(filter);
  
    res.json({
      data: normalizedProducts,
      pagination: {
        total,
        page: parsedPage,
        pages: Math.ceil(total / safeLimit),
      },
         priceRange: { minPrice: 100, maxPrice:1000 },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};


const createProduct = async (req, res) => {
  try {
    // لو بعتت منتج واحد (object) أو مجموعة (array)
    const data = Array.isArray(req.body) ? req.body : [req.body];
    
    const products = await Product.insertMany(data);
    
    res.status(201).json({
      message: data.length > 1 ? 'Products created successfully' : 'Product created successfully',
      data: products,
    });
  } catch (error) {
    console.error('Error creating product(s):', error);
    res.status(400).json({ message: 'Error creating product(s)', error: error.message || error });
  }
};


// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

module.exports = { getProducts, getProductById , createProduct};
