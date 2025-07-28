import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import { SessionCollection } from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Not authorized'));
  }

  try {
    const session = await SessionCollection.findOne({ accessToken: token });

    if (!session || session.accessTokenValidUntil < new Date()) {
      return next(createHttpError(401, 'Access token expired'));
    }

    jwt.verify(token, process.env.JWT_SECRET);

    req.user = { _id: session.userId };
    next();
  } catch (error) {
    next(createHttpError(401, 'Invalid token'));
  }
};
