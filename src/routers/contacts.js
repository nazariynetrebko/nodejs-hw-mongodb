import { Router } from 'express';

import {
  getContact,
  getContacts,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContact), isValidId);
router.post(
  '/contacts',
  ctrlWrapper(createContactController),
  validateBody(createContactSchema),
);
router.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactController),
  isValidId,
);
router.put(
  '/contacts/:contactId',
  ctrlWrapper(upsertContactController),
  isValidId,
  validateBody(createContactSchema),
);
router.patch(
  '/contacts/:contactId',
  ctrlWrapper(patchContactController),
  validateBody(createContactSchema),
  isValidId,
);

export default router;
