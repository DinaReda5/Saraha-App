import { Router } from "express";
import * as US from "./user.service.js";
import { accessRoles, authentication, authorization}  from "../../middleware/auth.js";
import * as UV from "./user.validation.js";
import { validation } from "../../middleware/validation.js";


const userRouter = Router()

userRouter.post("/signUp",validation(UV.signUpSchema), US.signUp)
userRouter.post("/signIn",US.signIn)
userRouter.get("/sendEmail/:token", US.sendingEmail)
userRouter.get("/getProfile", authentication, authorization(accessRoles.user), US.getProfile)
userRouter.get("/shareProfile/:id",validation(UV.shareProfileSchema),US.shareProfile)
userRouter.patch("/updateProfile", validation(UV.updateProfileSchema),authentication, US.updateProfile)
userRouter.patch("/updatePassword", validation(UV.updatePasswordSchema), authentication, US.updatePassword)
userRouter.delete("/freeseAcount", validation(UV.freeseAcountSchema),authentication, US.freeseAcount)



export default userRouter;