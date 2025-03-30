import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import { asyncHandler,eventEmitter, Hash ,Compare, decrypt, encrypt,generateToken, verifyToken  } from "../../utilits/index.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, gender, phone, role } = req.body;
  //check email
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return next(new Error("email already exists", { cause: 409 }));
  }
  //hashing password
  const hash = await Hash({ key:password, SALT_ROUNDS: process.env.SALT_ROUNDS });
  //encrypt phone
  const encryptedePhone = await encrypt({
    key: phone,
    SIGNATURE: process.env.SIGNATURE,
  });
  //send email
  eventEmitter.emit("sendEmail", { email });
  //send DB
  const user = await userModel.create({
    name,
    email,
    password: hash,
    gender,
    phone: encryptedePhone,
    role,
  });
  return res.status(201).json({ msg: "done and check your email", user });
});

export const sendingEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return next(new Error("token not found", { cause: 404 }));
  }

  const decoded = await verifyToken({
    token,
    SIGNATURE_SEND_EMAIL: process.env.SIGNATURE_SEND_EMAIL,
  });

  if (!decoded?.email) {
    return next(new Error("ivalid token payload", { cause: 404 }));
  }
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true }
  );
  if (!user) {
    return next(
      new Error("user not found or already confirmed", { cause: 400 })
    );
  }
  return res.status(201).json({ msg: "done" });
});
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, confirmed: true });
  if (!user) {
    return next(
      new Error("invalid email or not confirmed yet", { cause: 400 })
    );
  }
  const match = await Compare({ key:password, hashed: user.password });
  if (!match) {
    return next(new Error("invalid password", { cause: 400 }));
  }
  const token = await generateToken({
    payload: { email, id: user._id },
    SECRET_KEY:
      user.role == "user"
        ? process.env.SECRET_KEY_USER
        : process.env.SECRET_KEY_ADMIN,
  });
  return res.status(201).json({ msg: "done", token });
});
export const getProfile = asyncHandler(async (req, res, next) => {
  const phone = await decrypt({
    key: req.user.phone,
    SIGNATURE: process.env.SIGNATURE,
  });
  const messages = await messageModel.find({ userId: req.user._id })
  return res.status(200).json({ msg: "done", ...req.user, phone ,messages:messages});
});
// -------------------------------shareProfile----------------------------------
export const shareProfile = asyncHandler(async (req, res, next) => {
 const user =await userModel.findById(req.params.id).select("name email phone ")
  user? res.status(200).json({ msg: "done", user }):res.status(200).json({ msg: "user not found" })
});

// -------------------------------updateProfile----------------------------------
export const updateProfile = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
      req.body.phone = await encrypt({
    key: req.body.phone,
    SIGNATURE: process.env.SIGNATURE,
      });
  }
  const user =await userModel.findByIdAndUpdate(req.user._id,req.body,{new:true})
  return res.status(200).json({ msg: "done", user });
});


// -------------------------------updatePassword----------------------------------
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  
  if (!await Compare({ key: oldPassword, hashed: req.user.password })) {
    return next(new Error("old password not correct",{cause:400}))
  }
  const password = await Hash({ key: newPassword, SALT_ROUNDS: process.env.SALT_ROUNDS })
  const user =await userModel.findByIdAndUpdate(req.user._id,{password:password,passwordChangeAt:Date.now()},{new:true})
  return res.status(200).json({ msg: "done", user });
});

// -------------------------------freeseAcount----------------------------------
export const freeseAcount = asyncHandler(async (req, res, next) => {

  const user =await userModel.findByIdAndUpdate(req.user._id,{isDeleted:true,passwordChangeAt:Date.now()},{new:true})
  return res.status(200).json({ msg: "done", user });
});