import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/verifyEmail";


// connection
connect()

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json()

        const { email, fullName, password } = requestBody

        console.log({ requestBody })

        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({
                message: "User alredy exists with this email",
                success: false,
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        
        const newUser = new User({
            email,
            fullName, 
            password: hashedPassword
        })

        const savedUser = await newUser.save()

        console.log({savedUser})

        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: `We've sent an email at ${email}, please verify by clicking the verify button, else you'll not be able to login into the system`,
            success: true,
            data: savedUser
        })

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            success: false
        })
    }
}
