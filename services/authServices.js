import User from "../db/users.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const { BASE_URL } = process.env;

const createVerifyEmail = (email, verificationToken) => {
  return {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };
};

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(payload.email, { s: "250" }, true);
  const { email } = payload;
  const verifyEmail = createVerifyEmail(email, verificationToken);

  await sendEmail(verifyEmail);

  return User.create({
    ...payload,
    password: hashPassword,
    avatarURL, 
    verificationToken,
  });
};

export const verifyUser = async (verificationToken) => {
  const user = await findUser({ verificationToken });
  if (!user) throw HttpError(404, "User not found");

  return user.update({ verify: true, verificationToken: null });
};

export const resendVerifyUser = async (email) => {
  const user = await findUser({ email });
  if (!user) throw HttpError(404, "User not found");

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(verifyEmail);
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });
  if (!user) throw HttpError(401, "Email or password is incorrect");
  if (!user.verify) throw HttpError(401, "Email not verified");

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) throw HttpError(401, "Email or password is incorrect");

  const payload = {
    id: user.id,
  };
  const token = createToken(payload);
  user.token = token;
  await user.save();

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

export const logoutUser = async ({ email }) => {
  const user = await findUser({ email });
  if (!user) throw HttpError(401, "Not authorized");
  user.token = "";
  await user.save();
};

export const changeSubscription = async (userId, subscription) => {
  const user = await findUser({ id: userId });
  if (!user) throw HttpError(404, "User not found");

  user.subscription = subscription;
  await user.save();

  return user;
};


export const changeAvatar = async (userId, avatarPath) => {
  const user = await findUser({ id: userId });
  if (!user) throw HttpError(404, "User not found");

  user.avatarURL = avatarPath;
  await user.save();

  return user;
};
