import joi from "joi";
import { generalRules } from "../../utilits/generalRules/index.js"

export const sendMessageSchema = {
    body: joi.object({
       content:joi.string().min(1).max(100).required(),
        userId: generalRules.ObjectId.required()
    }).required()
 }