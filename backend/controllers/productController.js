const Product = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncCatch  = require("../middlewares/asyncCatch");
const APIFeatures = require("../utils/ApiFeatures");
const cloudinary = require("cloudinary");

//Save New Product in Databse => /api/v1/admin/products/new
exports.createNewProduct = asyncCatch(async(req,res,next)=>{

        req.body.user = req.user.id;

        let images = [];
        const imageLinks = [];

        if(typeof req.body.images === "string")
            images.push(req.body.images);
        else
            images = req.body.images;


        for(let i=0; i<images.length; i++) {
           
            const result = await cloudinary.v2.uploader.upload(images[i],{
                folder:"shopit"
            });

            imageLinks.push({
                public_id:result.public_id,
                url:result.secure_url
            });
        }

        req.body.images = imageLinks;

        const newProduct = await Product.create(req.body);

        res.status(201).json({
            success:true,
            product:newProduct
        });
        
});

// Get All Products => /api/v1/products
exports.getProducts = asyncCatch(async(req,res,next)=> {

        const perPage = 8;
        const productsCount=await Product.countDocuments();

        const apiFeatures = new APIFeatures(Product.find(), req.query)
                                  .search()
                                  .filter()
                                  .pagination(perPage);

        let  products = await apiFeatures.query;
        let filteredProductsCount=products.length;

        res.status(200).json({
            success:true,
            counts:products.length,
            productsCount,
            resultPerPage:perPage,
            filteredProductsCount,
            products
        });

});

// Get All Products <admin> => /api/v1/admin/products
exports.getAdminProducts = asyncCatch(async(req,res,next)=> {

    const products =await Product.find();

    res.status(200).json({
        success:true,
        products
    });

});

//Get single Product => /api/v1/:id
exports.getSingleProduct = asyncCatch(async(req,res,next)=>{

        const product = await Product.findById(req.params.id);

        if(!product) {
            return next(new ErrorHandler("Product is Not Found in Database",404));
        }  
        
        
        res.status(200).json({
            success:true,
            product:product
        })  
    
});

//Updata products => /api/v1/admin/products/:id
exports.updateProduct = asyncCatch(async(req,res,next)=>{

        const product = await Product.findById(req.params.id);

        if(!product) {
            return next(new ErrorHandler("Product is Not Found in Database",404));
        }
        
        let images = [];
        const imageLinks = [];

        if(typeof req.body.images === "string")
            images.push(req.body.images);
        else
            images = req.body.images;

        if(images) {
            for(let i=0; i<product.images.length; i++){
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            for(let i=0; i<images.length; i++) {
           
                const result = await cloudinary.v2.uploader.upload(images[i],{
                    folder:"shopit"
                });
    
                imageLinks.push({
                    public_id:result.public_id,
                    url:result.secure_url
                });
            }

            req.body.images = imageLinks;
        }

        const updated = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            useFindAndModify:false,
            runValidators:true
        })

        res.status(200).json({
            success:true,
            product:updated
        })
          
});

//Delete Product => /api/v1/admin/products/:id
exports.deleteProducts = asyncCatch(async(req,res,next)=>{

        const product = await Product.findById(req.params.id);
        
        if(!product) {
            return next(new ErrorHandler("Product is Not Found in Database",404));
        }

        for(let i=0; i<product.images.length; i++){
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success:true,
            message:"Product is Deleted."
        })
    
});

//create new review => /api/v1/review
exports.createNewReview = asyncCatch(async(req,res,next)=>{

    const { rating,comment,productId } = req.body;

    const review = {
        name:req.user.name,
        rating:rating,
        comment:comment,
        user:req.user._id
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(review=>review.user.toString() === req.user._id.toString());

    if(isReviewed) {

        product.reviews.forEach(review =>{
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        })
    }
    else{
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((accumulator,review)=>accumulator+review.rating,0)/product.reviews.length;

    await product.save({ validateBeforeSave:false });

    res.status(200).json({
        success:true,
        message:"Review Saved."
    })
});

//get all reviews for a specific product => /api/v1/reviews?id=:id
exports.getAllReviews = asyncCatch(async(req,res,next)=>{

    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success:true,
        reviews:product.reviews
    });
});

//delete user review => /api/v1/reviews
exports.deleteUserReview = asyncCatch(async(req,res,next)=>{

    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id);

    const numberOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc,review)=>acc + review.rating, 0) / (reviews.length || 1);

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        numberOfReviews,
        ratings
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    });
})