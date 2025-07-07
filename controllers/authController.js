import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  changeSubscription,
} from "../services/authServices.js";

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
  const { email, subscription } = req.user;
  res.json({ email, subscription });
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

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  getCurrentController: ctrlWrapper(getCurrentController),
  logoutController: ctrlWrapper(logoutController),
  subscriptionController: ctrlWrapper(subscriptionController),
};