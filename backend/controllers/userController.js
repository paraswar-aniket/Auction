import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js"
import { User } from "../models/userSchema.js";
import {v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwttoken.js";

export const register = catchAsyncErrors(async (req,res,next) => {
    if(!req.files || Object.keys(req.files).length == 0 ){
        return next(new ErrorHandler("Profile Image Required",400));
    }
 
    const {profileImage} = req.files;

    const allowedFormats = ["image/png","image/jpeg","image/jpg","image/webp",];

    if(!allowedFormats.includes(profileImage.mimetype)){
        
         return next(new ErrorHandler("File format not allowed",400));
    }

    const{
        userName,
        email,
        password,
        phone,
        address,
        role,
        bankAccountNumber,
        bankAccountName,
        bankName,
        upiId,
        paypalEmail,
    }=req.body;

    if(!userName || !email || !password || !phone || !address|| !role){
        return next(new ErrorHandler("Please fill all details",400));
    }

    if(role=="Auctioneer"){
        if(!bankAccountName || !bankAccountNumber || !bankName){
            return next(new ErrorHandler("Please fill all bank details",400));
        }

        if(!upiId){
            return next(new ErrorHandler("Please fill UPI ID",400));
        }

        if(!paypalEmail){
            return next(new ErrorHandler("Please fill Paypal Email",400));
        }
    }

    const isRegistered = await User.findOne({
        email
    });

    if(isRegistered){
        return next(new ErrorHandler("User already registered",400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath,{
        folder:"AUCTION_USERS",
    });

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "Cloudinary error",
            cloudinaryResponse.error || "Unknown Cloudinary Error"
        );
        return next(
            new ErrorHandler("Failed to upload image on Cloudinary ",500)
        );
    }

    const user = await User.create({
        userName,
        email,
        password,
        phone,
        address,
        role,
        profileImage: {
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        },
        paymentMethods: {
            bankTransfer:{
                bankAccountName,
                bankAccountNumber,
                bankName
            },
            upi:{
                upiId
            },
            paypal:{
                paypalEmail,
            },
        }
    });
    generateToken(user,"User Registered",201,res); 
})