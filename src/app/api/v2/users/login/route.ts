import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

// connection
connect()

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json()

        const { email, password } = requestBody

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({
                error: "User does not exist with this email"
            })
        }

        const isVerifiedPassword = await bcrypt.compare(password, user.password)

        if (!isVerifiedPassword) {
            return NextResponse.json({
                message: "Password is incorrect",
                success: false,
            })
        }

        const isUserVerified = user.isVerified

        if (!isUserVerified) {
            return NextResponse.json({
                message: "Please verify your email to login",
                success: false,
            })
        }

        const tokenData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: "1d"
        })

        const response = NextResponse.json({
            message: "Login succesfull",
            success: true,
            data: user
        })

        response.cookies.set("token", token, {httpOnly: true})

        return response

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        })
    }
}
