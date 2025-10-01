import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";


// connection
connect()

export async function POST(request: NextRequest) {
    try {
        const body= await request.json()
        const {token} = body

        const user = await User.findOne({verifyToken: token, verifyTokenExpiryDate: {$gt: new Date()}})

        console.log({user})
        if(!user){
            return NextResponse.json({
                success: false,
                message: "Invalid token"
            })
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiryDate = undefined

        user.save()

        return NextResponse.json({
            success: true,
            message: "User verified successfully"
        })
     } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            success: false
        })
    }
}
