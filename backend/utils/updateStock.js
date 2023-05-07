const Product = require("../models/productModel")

module.exports = async(id,quantity)=>{
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave:false });
}