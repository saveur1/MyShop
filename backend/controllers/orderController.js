const asyncCatch = require("../middlewares/asyncCatch");
const Order = require("../models/orderModel");
const updateStock = require("../utils/updateStock");
const ErrorHandler = require("../utils/ErrorHandler");

// creating new order  => /api/v1/order/new
exports.createNewOrder = asyncCatch(async(req,res,next)=>{

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(200).json({
        success:true,
        order
    })

});

//Get single Order by Id => /api/v1/order/:id
exports.getSingleOrder = asyncCatch(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("No order Found with that Id",404));
    }

    res.status(200).json({
        success:true,
        order
    })
});

//Get all order for logged user => /api/v1/orders/me
exports.getLoggedOrders = asyncCatch(async(req,res,next)=>{

    const orders = await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders
    });
});

//Get all order in databse => /api/v1/admin/orders -> admin only
exports.getAllOrders = asyncCatch(async(req,res,next)=>{

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    });
});

//update or process orders => /api/admin/order/:id
exports.updateSingleOrder = asyncCatch(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered") {
        return next(new ErrorHandler("This order is already Delivered",400));
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product,item.quantity);
    })

    order.orderStatus = req.body.status;

    await order.save();

    res.status(200).json({
        success: true
    })
});

//Delete order by its id => /api/v1/admin/order/:id
exports.deleteOrder = asyncCatch(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No order found with this ID",404));
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"Order Deleted."
    });
})
