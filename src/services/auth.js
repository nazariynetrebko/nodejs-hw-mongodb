import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXP = '15m';
const REFRESH_EXP = '30d';

export class AuthService {
  static async register({ name, email, password }) {
    const existing = await UsersCollection.findOne({ email });
    if (existing) {
      throw createHttpError(409, 'Email in use');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await UsersCollection.create({ name, email, password: hash });
    const { password: _, ...userData } = user.toObject();
    return userData;
  }

  static async login({ email, password }) {
    const user = await UsersCollection.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createHttpError(401, 'Email or password is wrong');
    }

    await SessionCollection.deleteMany({ userId: user._id });

    const accessToken = jwt.sign({ sub: user._id }, JWT_SECRET, {
      expiresIn: ACCESS_EXP,
    });
    const refreshToken = jwt.sign({ sub: user._id }, JWT_SECRET, {
      expiresIn: REFRESH_EXP,
    });

    const now = Date.now();
    const session = await SessionCollection.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(now + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(now + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken, userId: user._id };
  }

  static async refresh(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw createHttpError(401, 'Refresh token missing');
    }
    let payload;
    try {
      payload = jwt.verify(oldRefreshToken, JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Invalid refresh token');
    }

    const session = await SessionCollection.findOne({
      refreshToken: oldRefreshToken,
    });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    await SessionCollection.deleteOne({ _id: session._id });

    
    const accessToken = jwt.sign({ sub: payload.sub }, JWT_SECRET, {
      expiresIn: ACCESS_EXP,
    });
    const refreshToken = jwt.sign({ sub: payload.sub }, JWT_SECRET, {
      expiresIn: REFRESH_EXP,
    });

    const now = Date.now();
    await SessionCollection.create({
      userId: payload.sub,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(now + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(now + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  static async logout(refreshToken) {
    await SessionCollection.deleteOne({ refreshToken });
  }
}
