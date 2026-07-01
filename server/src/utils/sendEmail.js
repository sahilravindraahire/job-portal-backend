import dotenv from "dotenv"
dotenv.config()

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendOtpEmail = async(email, otp) => {
    try {
        const mailOptions = {
            from: `Job Portal < ${process.env.EMAIL_USER} >`,
            to: email,
            subject: `Your OTP for email-verification`,
            html: `
            <h1>Hello User</h1>
            <h2>Your OTP for email-verification for emailID ${email} is <b>${otp}</b></h2><br>
            <h2>This OTP expires in 5 min</h2>
            `
        }
        await transporter.sendMail(mailOptions)
        console.log(`email verification mail is send to ${email}`)
    } catch (error) {
        console.log(`send OTP email error: `, error.message)
    }
}

export const sendResponseEmail = async(email, fullName, companyName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Job offer from ${companyName}`,
            html: `
            <h1>Hello ${fullName}</h1>
            <h2>${companyName} is intersted to work with you</h2>
            <h2>Best wishes for your new journey</h2>
            `
        }
        await transporter.sendMail(mailOptions)
        console.log(`Response email is sent to ${email}`)
    } catch (error) {
        console.log(`send response email error: `, error.message)
    }
}

