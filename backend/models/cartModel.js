import  mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema({

   user:{
    type:mongoose.Types.ObjectId,
    ref:"accounts"
   },

   items: [
    {
    product :{
        type:mongoose.Types.ObjectId,
        ref:"products"
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



const cartModel = mongoose.model("carts",cartSchema)

export default cartModel;
