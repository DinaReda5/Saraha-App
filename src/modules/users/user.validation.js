import joi from "joi"
import { generalRules } from "../../utilits/generalRules/index.js"
import { enumGender } from "../../DB/models/user.model.js"

export const signUpSchema = {
    body: joi.object({
        name: joi.string().alphanum().min(3).max(5).messages({"string.min":"the name is short"}),
        email:generalRules.email,
        password: generalRules.password,
        cPassword: joi.string().valid(joi.ref("password")),
        gender: joi.string().valid(enumGender.male, enumGender.female),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/),
        role: joi.string()
    
    }).required().options({presence:"required"}).with("password","cPassword"),
    // query: joi.object({
    //     flag:joi.number().required()
    // })
    // ,
}
export const signInSchema = {
    body: joi.object({
        email:generalRules.email.required(),
        password: generalRules.password.required(),
    }).required()
}
export const updateProfileSchema = {
    body: joi.object({
        name: joi.string().alphanum().min(3).max(5).messages({"string.min":"the name is short"}),
        gender: joi.string().valid(enumGender.male, enumGender.female),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/),
    }).required()
    , headers:generalRules.headers.required()
}
export const updatePasswordSchema = {
    body: joi.object({
        oldPassword: generalRules.password.required(),
        newPassword: generalRules.password.required(),
        cPassword: generalRules.password.valid(joi.ref("newPassword")).required(),
    }).required()
    , headers:generalRules.headers.required()
}
export const freeseAcountSchema = {
   headers:generalRules.headers.required()
}
export const shareProfileSchema = {
   params:joi.object({
        id: generalRules.ObjectId.required()
    }).required()
 }