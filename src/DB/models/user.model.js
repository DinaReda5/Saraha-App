import mongoose from "mongoose";
import { accessRoles } from "../../middleware/auth.js";
export const enumGender = {
    male: "male",
    female:"female",
}


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // required: [true,"name is required"],
        lowercase:true,
        minLength: 3,
        maxLength: 10,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type: String,
        required: true,
        minLength:8
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum:Object.values(enumGender)
    },
    confirmed: {
        type: Boolean,
        default:false
    },
    role: {
        type: String,
        enum: Object.values(accessRoles),
        default:accessRoles.user
    },
    passwordChangeAt: Date,
    isDeleted:{
        type: Boolean,
        default:false
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt:true
    },
    // ,
    // capped: {
    //     size: 10000,
    //     max:20
    // },
    // collation:"",
    // autoCreate:true,
    // versionKey:false
})
const userModel = mongoose.models.User || mongoose.model("User", userSchema)
export default userModel
