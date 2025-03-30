import connectionDB from "./DB/connectionDB.js";
import messageRouter from "./modules/messages/message.controller.js";
import userRouter from "./modules/users/user.controller.js";
import { globalErrorHandler } from "./utilits/error/index.js";
import cors from "cors"
const bootstrap = (app, express) => {
  app.use(cors())
  app.use(express.json());
  app.use("/users", userRouter);
  app.use("/messages", messageRouter);
  connectionDB();
   // Home route
   app.get("/", (req, res, next) => {
    return res.status(200).json({message:"hello on saraha app"})
  });
  app.use("*", (req, res, next) => {
    return next(new Error(`invalid url ${req.originalUrl}`));
  });
 
  app.use(globalErrorHandler);
};
export default bootstrap;
