import express from "express"
import {upload} from "../middleware/multer.middleware.js"
import {verifyJwt} from "../middleware/auth.middleware.js"
import {registerUser, verifyOtp, loginUser, logoutUser, refreshAccessToken, changePassword, getProfile, updateProfile} from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.post("/regitser", upload.fields([
    {name: "profileImage", maxCount: 1},
    {name: "resume", maxCount: 1}
]), registerUser)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/login", loginUser)
userRouter.post("/logout", verifyJwt, logoutUser)
userRouter.post("/refresh-token", refreshAccessToken)
userRouter.patch("/change-password", verifyJwt, changePassword)
userRouter.get("/profile", verifyJwt, getProfile)
userRouter.patch("/profile", verifyJwt, upload.fields([
    {name: "profileImage", maxCount: 1},
    {name: "resume", maxCount: 1}
]), updateProfile)

export default userRouter