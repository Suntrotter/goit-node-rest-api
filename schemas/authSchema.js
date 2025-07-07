import Joi from "joi";
import { emailRegexp, passRegexp } from "../constants/auth.js";

export const authSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passRegexp).required(),
});