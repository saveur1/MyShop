const asyncCatch = require("../middlewares/asyncCatch");
const cloudinary = require("cloudinary");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


//Register User => /api/v1/register
exports.registerUser = asyncCatch(async(req,res,next)=>{

    const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"shopit",
        width:150,
        crop:"scale"
    });

    const { name,email,password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:result.public_id,
            url:result.secure_url
        }
    });

    sendToken(201,user,res);
});

//Login User => /api/v1/login
exports.loginUser = asyncCatch(async(req,res,next)=>{
    const {email,password} = req.body;

    //check if email and password are set
    if(!email || !password){
        return next(new ErrorHandler("Email and password are required",400));
    }

    //check if email is in databse
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    //check if password is in databse
    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(200,user,res);
});

//User forgot password => /api/v1/password/forgot
exports.userForgotPassword = asyncCatch(async(req,res,next)=>{

    const { email } = req.body;

    //getting user information
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Provided User Email Doesn't match Any in Database",404));
    }

    //get user token
    const resetToken = user.generateResetPasswordToken();

    await user.save({ validateBeforeSave:false });

    //generate reset link
    // const link = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const link = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    
    const message = `Your password reset Link is as follow\n\n${link}\n\nIf you have not requested this email. then egnore it!`;

    try {

        await sendEmail({
            email:email,
            subject:"ShopIt Password Recovery",
            message
        });

        res.status(200).json({
            success:true,
            message:`Email Sent To: ${email}`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save({validateBeforeSave:false});
        
        return next(new ErrorHandler(error.message,500));
    }
});


//User reset password => /api/v1/password/reset
exports.userResetPassword = asyncCatch(async(req,res,next)=>{

    const resetToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or has expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.password = req.body.password;

    await user.save();

    sendToken(200,user,res);
});

// Get user profile of logged user => /api/v1/profile
exports.getUserProfile = asyncCatch(async(req,res,next)=>{

    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success: true,
        user
    });
})

//UPdate User password => /api/v1/password/update

exports.updateUserPassword = asyncCatch(async(req,res,next)=>{

    const user = await User.findById(req.user._id).select("+password");

    //compare if old password match to what is in database;
    const isMatch = await user.comparePassword(req.body.oldPassword);

    if(!isMatch){
        return next(new ErrorHandler("Existing Password is Incorrect",400));
    }

    user.password = req.body.password;

    await user.save();

    sendToken(200, user, res);
})


//Upadate Profile of currently logged in user => /api/v1/profile/update
exports.updateUserProfile = asyncCatch(async(req,res,next)=>{
    const newData = {
        name:req.body.name,
        email:req.body.email
    };

    // Update Profile Avatar
    if(req.body.avatar){
        const user = await User.findById(req.user.id);

        const image_id = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"shopit",
            width:150,
            crop:"scale"
        });

        newData.avatar = {
            public_id:result.public_id,
            url:result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id,newData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });
})


//Logout User => /api/v1/logout
exports.logoutUser = asyncCatch(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"User Logged out."
    });
})


//Get all Users => /api/v1/admin/users -> admin only route
exports.getAllUsers = asyncCatch(async(req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    });
})

//get User Details => /api/v1/admin/user/:id -> admin only route
exports.getUserDetails = asyncCatch(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User with id ${req.params.id} is not found in database`,400))
    }

    res.status(200).json({
        success:true,
        user
    });
});

//Update user details => /api/user/:id -> admin only route
exports.updateUserInfo = asyncCatch(async(req,res,next)=>{

    const userInfo ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,userInfo,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        user
    }); 
});

//Delete user => /api/v1/admin/user/:id
exports.deleteUser = asyncCatch(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User with Id ${req.params.id} is not Registered`,400));
    }

    // delete user profile also
    const public_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(public_id);

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"User is Deleted."
    });
})