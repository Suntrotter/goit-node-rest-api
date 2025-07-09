import express from "express";
import validateBody from "../helpers/validateBody.js";
import { authSchema } from "../schemas/authSchema.js";
import { subscriptionSchema } from "../schemas/subscriptionSchema.js";
import authController from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";
import { authVerifySchema } from "../schemas/authSchema.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(authSchema),
  authController.registerController
);

authRouter.get("/verify/:verificationToken", authController.verifyUserEmail);

authRouter.post(
  "/verify",
  validateBody(authVerifySchema),
  authController.resendVerificationEmail
);

authRouter.post(
  "/login",
  validateBody(authSchema),
  authController.loginController
);

authRouter.get("/current", authenticate, authController.getCurrentController);

authRouter.post("/logout", authenticate, authController.logoutController);

authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(subscriptionSchema),
  authController.subscriptionController
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.avatarsController
);

export default authRouter;
