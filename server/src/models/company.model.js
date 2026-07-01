import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    companyProfileImage: {
        type: String
    },
    companyProfileImagePublicId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, 
{timestamps: true})

export const Company = mongoose.model("Company", companySchema)