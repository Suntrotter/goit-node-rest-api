import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[\d\s\-().]+$/)
    .required()
    .messages({
      "string.pattern.base": "Phone format is invalid",
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(/^[\d\s\-().]+$/)
    .messages({
      "string.pattern.base": "Phone format is invalid",
    }),
});

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean(),
});