import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["employe", "employer"],
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    profileImagePublicId: {
        type: String
    },
    resume: {
        type: String,
    },
    resumePublicId: {
        type: String
    },
    skills: {
        type: String
    },
    bio: {
        type: String
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    refreshToken: {
        type: String
    },
}, 
{timestamps: true})

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECERET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)