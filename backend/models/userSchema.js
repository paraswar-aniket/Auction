import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        minLength: [3, "Username must be at least 3"],
        maxLenght: [40, "Max length must be 40"]
    },
    password: {
        type: String,
        selected: false,
        minLength: [8, "Paasword must be at least 8"],
        maxLenght: [40, "Max length must be 40"]
    },
    email: String,
    address: String,
    phone: {
        type: String,
        minLength: [10, "Number must be of 10 digit"],
        maxLenght: [10, "Number must be of 10 digit"]
    },
    profileImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    paymentMethods: {
        bankTransfer: {
            bankAccountNumber: String,
            bankAccountName: String,
            bankName: String,
        },
        upi: {
            upiId: String,
        },
        paypal: {
            paypalEmail: String,
        }
    },
    role: {
        type: String,
        enum: ["Auctioneer", "Bidder", "Super Admin"],
    },
    unpaidComission: {
        type: Number,
        default: 0,
    },
    auctionsWon:{
        type: Number,
        default: 0,
    },
    moneySent:{
        type: Number,
        default: 0,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }

});

userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next(); 
    }
    this.password = await bcrypt.hash(this.password,10);
})


userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign(
        {id : this._id},
        process.env.JWT_SECRET_KEY,
        {
            expiresIn : process.env.JWT_EXPIRE
        }
    );
}
export const User = mongoose.model('User',userSchema);