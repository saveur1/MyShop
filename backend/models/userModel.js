const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"User Name is required Please"],
        trim: true,
        maxLength:[30,"User Name can not exceed 30 character"]
    },
    email:{
        type: String,
        required: [true,"Email is required Please"],
        trim: true,
        validate: [validator.isEmail,"Please enter a valid email"],
        unique: true,
        message:"Email Already Exists in Database"
    },
    password:{
        type: String,
        required: [true,"Password is required Please"],
        select: false,
        minLength:[6,"Password must be atleast 6 characters"],
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        required: [true,"Role is required Please"],
        trim: true,
        enum: ["user","admin"],
        default:"user"
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpires:{
        type: Date
    }
});

//hash password before saving
userSchema.pre("save",async function(next){
    if(!this.isModified()){
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
});

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//generate token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

//generate password reset token
userSchema.methods.generateResetPasswordToken = function(){
    //generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hash and set it to resetPasswordToken
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    //set token expire time
    this.resetPasswordExpires = Date.now()+30*60*1000;

    return resetToken;
}


module.exports = mongoose.model("User",userSchema);