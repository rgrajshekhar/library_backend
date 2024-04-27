import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { ApiResponse} from "../utils/ApiResponse.js"

const generateAccessandRefreshToken = async(userId) =>{
   try {
      const user = await User.findById(userId)
      const accesstoken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      
      user.refreshToken = refreshToken
      await user.save({validateBeforeSave: false})

      return {accesstoken,refreshToken}

   } catch (error) {
      throw new ApiError(500,"Something went wrong while generating access token and refresh token")
   }
}

const registerUser = asyncHandler( async (req,res) => {
 const {fullname, email, username, password, phone} =  req.body
 console.log(fullname,email,username,password,phone)

 if (
    [fullname,email,username,password,phone].some((field) => field?.trim() === "")
 ) {
    throw new ApiError(400,"All fields are required")
 }

 const existedUser = await User.findOne({
    $or:[{username},{email}]
 })

 if(existedUser){
   throw new ApiError(400,"User with username or email already existed ")
 }

 const userCreated = await User.create({
   fullname,
   email,
   username,
   password,
   phone
 })

 const user = await User.findById(userCreated._id).select(
   "-password -verifyToken -refreshToken -accessToken"
 )

 if(!user){
   throw new ApiError(500,"Something went wrong while registering new user")
 }

 return res.status(201).json(
   new ApiResponse(200, user, "User Registered Successfully!!!")
 )


})


const loginUser = asyncHandler(async (req,res) => {
   const {username, email, password} = req.body

   if (!username || !email) {
      throw new ApiError(400,"username or email is required")
   }

   const user = await User.findOne({
      $or:[{username},{email}]
   })

   if (!user) {
      throw new ApiError(404,"User does not exist")
   }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
      throw new ApiError(404,"Invalid Password")
   }

   const {accessToken , refreshToken} = await generateAccessandRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id).select("-password ")

   const options = {
      httpOnly: true,
      secure: true,
   }

   return res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
      new ApiResponse(
         200,
         {
            user: loggedInUser, accessToken, refreshToken
         },
         "User logged in successfully"
      )
   )
})

const logoutUser = asyncHandler(async(req,res) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set:{
            refreshToken: undefined
         }
      },
      {
         new: true
      }
   )

   const options = {
      httpOnly: true,
      secure: true,
   }

   return res.status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(
      new ApiResponse(200, {}, "User Logged Out")
   )

})


export {
   registerUser,
   loginUser,
   logoutUser
}