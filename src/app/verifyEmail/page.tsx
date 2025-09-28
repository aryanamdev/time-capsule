"use client"
import { useEffect } from "react"
import { ROUTES } from "../constants/routes"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const VerifyEmail = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const token = searchParams.get("token")

    if(!token){
        return <>Invalid token</>
    }

    console.log({token})

    const verifyEmail = async () => {
        try {
            const response = await axios.post(ROUTES.USER.VERIFY_EMAIL, { token })

            const data = await response.data

            if(!data?.success){
                throw new Error(data?.message || "Error verifying email")
            }

            toast.success(data?.message)
            router.push("/login")

        } catch (error) {
            toast.error("Error verifying email")
            console.error("Error verifying email", error)
        }}

    useEffect(() => {
        verifyEmail()

        return () => {}
    }, [])


    return <>Verify Email</>
}


export default VerifyEmail