import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import 'dotenv/config';
import { createDirIfNotExist } from './utils/createDirIfNotExist.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const startServer = async () => {
  try {
    await initMongoConnection();
    await createDirIfNotExist(TEMP_UPLOAD_DIR);
    await createDirIfNotExist(UPLOAD_DIR);
    setupServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
