import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  changeSubscription,
  changeAvatar,
  verifyUser,
  resendVerifyUser,
} from "../services/authServices.js";
import { join, resolve } from "path";
import { rename } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const avatarDir = resolve("public", "avatars");

const registerController = async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body);

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw HttpError(409, "Email in use");
    }
    throw err;
  }
};

const loginController = async (req, res, next) => {
  const { token, user } = await loginUser(req.body);
  res.json({ token, user });
};

const getCurrentController = async (req, res, next) => {
  const { email, subscription, avatarURL  } = req.user;
  res.json({ email, subscription, avatarURL  });
};

const logoutController = async (req, res, next) => {
  await logoutUser(req.user);
  res.status(204).json("No Content");
};

const subscriptionController = async (req, res, next) => {
  const { id } = req.user;
  const { subscription } = req.body;

  if (!["starter", "pro", "business"].includes(subscription)) {
    throw HttpError(400, "Invalid subscription value");
  }

  const updatedUser = await changeSubscription(id, subscription);
  res.json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const avatarsController = async (req, res, next) => {
  console.log("req.file:", req.file);
  const { id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Avatar file is missing");
  }

  const { path: oldPath, originalname } = req.file;
  const filename = `${uuidv4()}_${originalname}`;
  const newPath = join(avatarDir, filename);
  await rename(oldPath, newPath);

  const avatarURL = join("avatars", filename);
  const changedUser = await changeAvatar(id, avatarURL);

  res.json({
    avatarURL: changedUser.avatarURL,
  });
};

const verifyUserEmail = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;

  await verifyUser(verificationToken);

  res.status(200).json({ message: "Verification successful" });
});

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw HttpError(400, "Missing required field email");
  }

  await resendVerifyUser(email);
  res.json({
    message: "Verification email sent",
  });
};

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  getCurrentController: ctrlWrapper(getCurrentController),
  logoutController: ctrlWrapper(logoutController),
  subscriptionController: ctrlWrapper(subscriptionController),
  avatarsController: ctrlWrapper(avatarsController),
  verifyUserEmail: ctrlWrapper(verifyUserEmail),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
};
