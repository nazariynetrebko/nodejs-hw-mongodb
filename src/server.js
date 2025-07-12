import express from 'express';
import cors from 'cors';
import pino from 'pino';

import contactsRouter from './routers/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(express.json());
  app.use(cors());

  app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url }, 'Incoming request');
    next();
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'Express server is running',
    });
  });

  app.use(contactsRouter);

  app.get('/hw02', (req, res) => {
    res.json({ message: 'HW2 endpoint' });
  });

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};
