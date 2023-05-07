const ErrorHandler = require("../utils/ErrorHandler");

module.exports =(req,res,next)=>{
    return next(new ErrorHandler("Page Not Found",404));
}