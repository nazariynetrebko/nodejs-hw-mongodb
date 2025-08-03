import { AuthService, requestResetToken } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';
import createHttpError from 'http-errors';

export const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    if (!req.body) {
      throw createHttpError(400, 'Request body is missing');
    }
    const { accessToken, refreshToken } = await AuthService.login(req.body);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await AuthService.refresh(
      req.cookies.refreshToken,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await AuthService.logout(req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    await AuthService.requestResetToken(req.body.email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await AuthService.resetPassword(req.body);
    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
