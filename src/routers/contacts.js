import { Router } from 'express';

import {
  getContact,
  getContacts,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; // Не забудьте .js тут також!

const router = Router();

router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContact)); // Цей рядок є підозрілим
router.post('/contacts', ctrlWrapper(createContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController)); // Цей рядок також
router.put('/contacts/:contactId', ctrlWrapper(upsertContactController)); // І цей
router.patch('/contacts/:contactId', ctrlWrapper(patchContactController)); // І цей

export default router;
