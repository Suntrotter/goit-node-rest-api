import User from "../db/users.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const avatarURL = gravatar.url(payload.email, { s: "250" }, true);

  return User.create({
    ...payload,
    password: hashPassword,
    avatarURL, 
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });
  if (!user) throw HttpError(401, "Email or password is incorrect");

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

// Логаут
export const logoutUser = async ({ email }) => {
  const user = await findUser({ email });
  if (!user) throw HttpError(401, "Not authorized");
  user.token = "";
  await user.save();
};

// Зміна підписки
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
