import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utilits/index.js";


// ------------------------------sendMessage---------------------------------------
export const sendMessage = asyncHandler( async(req,res,next) => {
    const { content, userId } = req.body;
    if (!await userModel.findOne({ _id: userId, isDeleted: false })) {
        return next(new Error("user not foundd",{cause:404}))
    }
    const message = await messageModel.create({ content, userId })
    return res.status(200).json({msg:"done",message})
})

// ------------------------------getMessages---------------------------------------
export const getMessages = asyncHandler( async(req,res,next) => {
    const messages = await messageModel.find({ userId: req.user._id }).populate({
        path: "userId",
        select:"name"
  })
    return res.status(200).json({msg:"done",messages})
})