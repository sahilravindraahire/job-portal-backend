import dotenv from "dotenv"
dotenv.config()

import express from "express"
import {connecDB} from "../src/db/dataBase.js"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

import userRouter from "./routes/user.route.js"
import jobRouter from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js"
import companyRouter from "./routes/company.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/jobs", jobRouter)
app.use("/api/v1/applications", applicationRoute)
app.use("/api/v1/company", companyRouter)

const port = process.env.PORT || 5000

connecDB()
.then(() => {
    try {
        app.listen(port, () => {
            console.log(`server is at http://localhost:${port}`)
        })
    } catch (error) {
        console.log(`error while connecting server: ${error.message}`)
    }
})