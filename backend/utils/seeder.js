const Product = require("../models/productModel");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

dotenv.config({path:"backend/config/config.env"});
const products = require("../data/products.json");

connectDatabase();

const importDataIntoDatabase = async()=>{
    try {
        await Product.insertMany(products);
        console.log("Product inserted Successfully!!");

        process.exit(1);
    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
}

importDataIntoDatabase();