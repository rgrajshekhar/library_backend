import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
    {
     username:{
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        index:true,
     },
     fullname:{
        type: String,
        required: [true, "Please provide a fullname"],
        index:true,
     },
     email: {
        type: String,
        required:[true, "Please provide a email"],
        unique: true,   
        index:true,
     },
     password:{
        type: String,
        required:[true, "Please provide a password"]
     },
     phone:{
        type: Number,
     },
     isVerified:{
        type:Boolean,
        default:false,
     },
     isAdmin:{
        type:Boolean,
        default: false,
     },
     verifyToken : String,
     verifyTokenExpiry:Date,
     forgetPasswordToken: String,
     forgetPasswordTokenExpiry: Date,
     refreshToken:String,
     refreshTokenExpiry:Date,
    }
)
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.models.users || mongoose.model("users",userSchema);

