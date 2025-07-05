import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { getEnvVar } from './utils/getEnvVar.js';
import { getContact, getContacts } from './controllers/contacts.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url }, 'Incoming request');
    next();
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'Express server is running',
    });
  });

  app.get('/hw02', (req, res) => {
    res.json({ message: 'HW2 endpoint' });
  });

  app.use((req, res, next) => {
    console.log(`--> ${req.method} ${req.originalUrl}`);
    next();
  });

  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContact);

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  return app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};
