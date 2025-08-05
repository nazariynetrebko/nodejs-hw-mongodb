import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
