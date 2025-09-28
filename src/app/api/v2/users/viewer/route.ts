import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken"
import User from "@/models/userModel";

connect()


export async function GET(request: NextRequest){
    try {
        const token = request.cookies.get("token")?.value || ""

        //token information

        //!Todo: remove any
        const tokenData: any = jwt.verify(token, process.env.TOKEN_SECRET!)
        const userId = tokenData?.id 

        const viewer = await User.findOne({_id: userId})

        return NextResponse.json({
            message: "User found",
            data: viewer,
            success: true
        })


    } catch (error: any) {
        NextResponse.json({
            message: error.message || "Internal server error",
            success: false,
        })
    }
}