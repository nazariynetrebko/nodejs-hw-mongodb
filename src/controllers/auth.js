import { AuthService } from '../services/auth.js';
import createHttpError from 'http-errors';

export const register = async (req, res) => {
  const user = await AuthService.register(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
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

export const refresh = async (req, res) => {
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
};

export const logout = async (req, res) => {
  await AuthService.logout(req.cookies.refreshToken);
  res.clearCookie('refreshToken');
  res.sendStatus(204);
};
