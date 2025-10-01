import nodemailer from "nodemailer"
import User from "@/models/userModel"
import bcrypt from "bcryptjs"
import { MailOptions } from "nodemailer/lib/sendmail-transport"


const ONE_DAY = 24 * 60 * 60 * 1000
export interface SendEmailProps {
    email: string,
    emailType: "VERIFY" | "FORGOT",
    userId: string
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailProps) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10)


        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiryDate: new Date(Date.now() + ONE_DAY)
            })


        } else {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiryDate: new Date(Date.now() + ONE_DAY)
            })
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAIL_TRAP_USER!,
                pass: process.env.EMAIL_TRAP_PASSWORD!
            }
        });

        const mailOptions: MailOptions = {from: "thetangledguy@gmail.com", to: email, subject: emailType === "VERIFY" ? "Verify your mail" : "Reset your password",
            html: `<p>Click <a href=${process.env.DOMAIN}/verifyEmail?token=${hashedToken}>Here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}`
        }

        const response = await transport.sendMail(mailOptions)

        return response

    } catch (error: any) {
        throw new Error(error?.message || "")
    }
}