import {User} from "../models/user.model.js"
import {OTP} from "../models/otp.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import {sendOtpEmail} from "../utils/sendEmail.js"
import bcrypt from "bcryptjs"
import jwt, { decode } from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
    
        await user.save({validateBeforeSave: false})
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token")
    }
}

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
}

export const registerUser = asyncHandler(async(req, res) => {
    const {fullName, email, password, phoneNumber, role, skills, bio} = req.body

    if([!fullName || !email || !password || !phoneNumber || !role].some((f) => !f?.toString().trim())){
        throw new ApiError(400, "fullName, email, password, phoneNumber and role are required")
    }

    if(!["employe", "employer"].includes(role)){
        throw new ApiError(400, "role must be 'employe' or 'employer'")
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new ApiError(409, "user already exists")
    }

    if(role === "employe" && !req.files?.resume?.[0]){
        throw new ApiError(400, "Resume is required for employees")
    }
    
    let profileImageUrl = ""
    let profileImagePublicId = ""
    let resumeUrl = ""
    let resumePublicId = ""

    if(req.files?.profileImage?.[0]){
        const uploadRes = await uploadOnCloudinary(req.files.profileImage[0].path)

        if(!uploadRes){
            throw new ApiError(500, "Failed to upload profile image")
        }

        profileImageUrl = uploadRes.secure_url
        profileImagePublicId = uploadRes.public_id
    }

    if(req.files?.resume?.[0]){
        const uploadRes = await uploadOnCloudinary(req.files?.resume?.[0]?.path)

        console.log(uploadRes)

        if(!uploadRes){
            throw new ApiError(500, "Failed to upload resume")
        }

        resumeUrl = uploadRes.secure_url
        resumePublicId = uploadRes.public_id
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
        skills: skills || "",
        bio: bio || "",
        profileImage: profileImageUrl,
        profileImagePublicId,
        resume: resumeUrl,
        resumePublicId,
    })

    if(!user){
        throw new ApiError(500, "error while registering user")
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await OTP.create({email, otp})

    await sendOtpEmail(email, otp)

    return res
    .status(201)
    .json(new ApiResponse(201, "Registration successful. OTP sent to your email"))
})

export const verifyOtp = asyncHandler(async(req, res) => {
    const {email, otp} = req.body

    if(!email || !otp){
        throw new ApiError(400, "email and otp are required")
    }

    const otpRecord = await OTP.findOne({email})

    if(!otpRecord){
        throw new ApiError(400, "OTP has expired or is invalid")
    }

    if(otpRecord.otp !== otp){
        throw new ApiError(400, "incorrect otp")
    }

    const user = await User.findOneAndUpdate(
        {email},
        {isVerified: true},
        {new: true}
    ).select("-password")

    if(!user){
        throw new ApiError(404, "user not found")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    await OTP.findOneAndDelete({email})

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, 
        {
            user,
            accessToken,
            refreshToken
        },
        "otp verified successfully"
    ))
})

export const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400, "Email and password are required")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "user not found")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if(!passwordMatch){
        throw new ApiError(401, "Invalid credentials")
    }

    if(!user.isVerified){
        throw new ApiError(403, "Please verify your email before logging in")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, 
        {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        "user logged in successfully"
    ))
})

export const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {refreshToken: 1}
        },
        {returnDocument: "after"}  // tells Mongoose which version of the document should be returned after the update operation.
    )

    return res
    .status(200)
    .cookie("accessToken", cookieOptions)
    .cookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "logged out successfully"))
})

export const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(403, "invalid refresh token")
    }

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(401, "refresh token is already used or expired")
    }

    const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new ApiResponse(200,
        {
            accessToken,
            refreshToken: newRefreshToken
        },
        "access token refreshed"
    ))
})

export const changePassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body

    if(!oldPassword || !newPassword || !confirmPassword){
        throw new ApiError(401, "all fields are required")
    }

    const user = await User.findById(req.user._id)

    if(!user){
        throw new ApiError(400, "error while fetching user")
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)

    if(!isPasswordMatch){
        throw new ApiError(401, "Incorrect password")
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashPassword
    await user.save({validateBeforeSave: false})

    if(newPassword !== confirmPassword){
        throw new ApiError(401, "new password and confirm password should be the same")
    }

    return res 
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"))
})

export const getProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    .select("-password -refreshToken")
    .populate("company", "name location website companyProfileImage")

    if(!user){
        throw new ApiError(404, "User not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "profile fetched"))
})

export const updateProfile = asyncHandler(async(req, res) => {
    const {fullName, phoneNumber, skills, bio} = req.body

    const updateFields = {}

    if(fullName) updateFields.fullName = fullName
    if(phoneNumber) updateFields.phoneNumber = phoneNumber
    if(skills !== undefined) updateFields.skills = skills
    if(bio !== undefined) updateFields.bio = bio

    const user = await User.findById(req.user._id)

    if(req.files?.profileImage?.[0]){
        if(user.profileImagePublicId){
            await deleteFromCloudinary(user.profileImagePublicId)
        }
        const uploadRes = await uploadOnCloudinary(req.files?.profileImage[0]?.path)
        if(!uploadRes){
            throw new ApiError(500, "Failed to upload profile image")
        }
        updateFields.profileImage = uploadRes.secure_url
        updateFields.profileImagePublicId = uploadRes.public_id
    }

    if(req.files?.resume?.[0]){
        if(user.resumePublicId){
            await deleteFromCloudinary(user.resumePublicId)
        }
        const uploadRes = await uploadOnCloudinary(req.files?.resume[0]?.path)
        if(!uploadRes){
            throw new ApiError(500, "Failed to upload resume")
        }
        updateFields.resume = uploadRes.secure_url
        updateFields.resumePublicId = uploadRes.public_id
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {$set: updateFields},
        {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"))
})