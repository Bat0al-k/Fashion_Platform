import  mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema({

   user:{
    type:mongoose.Types.ObjectId,
    ref:"user"
   },

   cartItems: [
    {
    product :{
        type:mongoose.Types.ObjectId,
        ref:"product"
    },
   quantity:{
    type:Number,
    default: 1
   },
   price : Number 
}],

    totalPrice:Number,
    discount:Number,
    totalPriceAfterDiscount:Number

},{
    timestamps : true
});



const cartModel = mongoose.model("Cart",schema)

export default cartModel;