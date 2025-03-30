import jwt from "jsonwebtoken";
import userModel from "../DB/models/user.model.js";
import { asyncHandler } from "../utilits/error/index.js";

export let accessRoles = {
  user: "user",
  admin: "admin",
};
export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const [prefix, token] = authorization?.split(" ") || [];
  if (!prefix || !token) {
    return next(new Error("invalid token", { cause: 401 }));
  }
  let SIGNATURE = undefined;
  if (prefix === "admin") {
    SIGNATURE = process.env.SECRET_KEY_ADMIN;
  } else if (prefix === "bearer") {
    SIGNATURE = process.env.SECRET_KEY_USER;
  } else {
    return next(new Error("ivalid token prefix", { cause: 401 }));
  }

  const decoded = jwt.verify(token, SIGNATURE);
  if (!decoded?.id) {
    return next(new Error("ivalid token payload", { cause: 403 }));
  }
  const user = await userModel.findById(decoded.id).lean();
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  if (user?.isDeleted) {
    return next(new Error("user is deleted", { cause: 401 }));
 }
  if (parseInt(user?.passwordChangeAt.getTime() / 1000) > decoded.iat) {
    return next(new Error("token expire login again", { cause: 401 }));
  }
  req.user = user;
  next();
});
export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req?.user?.role)) {
      return next(new Error("access denied", { cause: 401 }));
    }
    next();
  });
};
