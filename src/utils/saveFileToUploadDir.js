import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants';
import { getEnvVar } from './getEnvVar';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );
  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};
