const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:[true,"Address is required please"]
        },
        city:{
            type:String,
            required:[true,"Shipping city is required please"]
        },
        phone:{
            type:String,
            required:[true,"Phone Number is required please"]
        },
        postalCode:{
            type:String,
            required:[true,"Your Postal Code is required please"]
        },
        country:{
            type:String,
            required:[true,"country is required please"]
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"Product"
            }
        }
    ],
    paymentInfo:{
        id:{
            type:String
        },
        status:{
            type:String
        }
    },
    paidAt:{
        type:Date
    },
    itemsPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredAt:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});


module.exports = mongoose.model("Order", orderSchema);