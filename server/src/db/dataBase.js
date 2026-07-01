import mongoose from "mongoose"

export const connecDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`mongoDB connected: ${conn.connection.host}`)
    }
     catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}