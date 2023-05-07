const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error";

    if(process.env.NODE_ENV==="DEVELOPMENT") {
        res.status(error.statusCode).json({
            success:false,
            error,
            errorMessage:error.message,
            stack:error.stack
        })
    }

    if(process.env.NODE_ENV === "PRODUCTION"){

        if(error.name === "CastError") {
            const message = `Resource Not Found. Invalid ${error.path}`;
            error = new ErrorHandler(message,400);
        }
        
        if(error.name ==="ValidationError") {
            const message = Object.values(error.errors).map(val => val.message);
            error = new ErrorHandler(message,400);
        }

        if(error.code === 11000){
            const message = `${Object.keys(error.keyValue)} Already exists in database`;
            error = new ErrorHandler(message,400);
        }

        console.log(error);
        if(error.message === "Could not decode base64") {
            const message = "Invalid Images uploaded. One Image shoud not exceed 1.2 mega bytes(MB)";
            error = new ErrorHandler(message,400);
        }

        if(error.name === "JsonWebTokenError"){
            const message = "JSON web token is invalid. Try Again!!!";
            error = new ErrorHandler(message,400);
        }

        if(error.name === "TokenExipiredError"){
            const message = "JSON web token is Expired. Try Again!!!";
            error = new ErrorHandler(message,400);
        }

        res.status(error.statusCode).json({
            success:false,
            message:error.message || "Internal Server Error"
        });
    }
}