import mongoose, { mongo, Mongoose, Schema } from "mongoose";

const userSchema: Schema = new mongoose.Schema({
    fullName: {
        type: "String",
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: "String",
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: "String",
        required: [true, "Password is required"],

    },
    isVerified: {
        type: Boolean,
        default: false,

    },
    role: {
        type: "String",
    },
    forgotPasswordToken: "String",
    forgotPasswordTokenExpiryDate: "String",
    verifyToken: "String",
    verifyTokenExpiryDate: "String",

})

const User = mongoose.models.User ||  mongoose.model("User", userSchema)

export default User