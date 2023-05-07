const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncCatch = require("./asyncCatch");
const User = require("../models/userModel");

//check if user is authanticated
exports.CheckAuth = asyncCatch(async(req,res,next)=>{

    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler("Login First To Access this resource",401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
});

//Authorize user base on role
exports.CheckRole = (...roles)=>{
    return (req,res,next)=>{
        
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`,403)
            );
        }
        next();
    }
}