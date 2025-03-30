import { EventEmitter } from "events";
import { sendEmail } from "../../service/sendEmail.js";
import { generateToken } from "../token/generateToken.js";
export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async (data) => {
  //confirm email
  const { email } = data;
  const token = await generateToken({
    payload: { email },
    SECRET_KEY: process.env.SIGNATURE_SEND_EMAIL,
    option: { expiresIn: "10m" },
  });
  const link = `http://localhost:3000/users/sendEmail/${token}`;
  await sendEmail(email, "confirm email", `<a href=${link}>confirm me</a>`);
});
