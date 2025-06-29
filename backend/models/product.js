const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ["women", "Men", "Kids"]
  },
  subcategory: {
    type: String,
    required: true,
    enum: ["T-Shirts", "Pants", "Watches"]
  },
  instock: {
    type: Number,
    default: 0
  },
  istrending: {
    type: Boolean,
    default: false
  },
  sizes: [{ type: String }],
  colors: [{ type: String }],

  defaultSize: {
  type: String
},
defaultColor: {
  type: String
},
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, { timestamps: true });

//  إضافة virtual id بدل _id
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('product', productSchema);
