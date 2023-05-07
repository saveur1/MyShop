const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Product Name"],
        trim:true,
        maxLength:[100,"Product Name cannot exceed 100 characters"]
    },
    price:{
        type:Number,
        required:[true, "Please Enter Product price"],
        maxLength:[9,"Product price cannot exceed 9 characters"],
        default:0.0
    },
    description:{
        type:String,
        required:[true, "Please Enter Product description"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please Select Category for this Product"],
        enum:{
            values:[
                "Electronics",
                "Cameras",
                "Laptops",
                "Accessories",
                "Headphones",
                "Food",
                "Books",
                "Clothes/Shoes",
                "Beauty/Health",
                "Sports",
                "Outdoor",
                "Home"
            ],
            message:"Please select correct category for product"
        }
    },
    seller:{
        type:String,
        required:[true,"Please Enter Product Seller"]
    },
    stock:{
        type:Number,
        required:[true,"please Enter product stock"],
        maxLength:[5,"Product Stock cannot exceed 5 character"]
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:[true,"please Enter reviewer Name"]
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            rating:{
                type:Number,
                required:[true,"Review rating is required please"]
            },
            comment:{
                type:String,
                required:[true,"Comment is required please"]
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Product",productSchema);