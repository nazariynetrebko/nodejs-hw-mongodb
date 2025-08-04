import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import createHttpError from 'http-errors';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { UsersCollection } from '../db/models/user.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { SaveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { AuthService } from '../services/auth.js';

export const getContacts = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const contacts = await getAllContacts(
      {
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
      },
      req.user._id,
    );

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error in getContacts:', error);
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId, req.user._id);
  console.log('Contact retrieved:', contact);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const payload = { ...req.body, userId: req.user._id };
  const contact = await createContact(payload);

  if (req.file) {
    const cloudUrl = await SaveFileToCloudinary(req.file);
    payload.photo = cloudUrl;
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(204).send();
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body, req.user._id, {
    upsert: true,
  });
  if (!result) {
    return next(createHttpError(404, 'Contact not found'));
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully ${result.isNew ? 'created' : 'updated'} contact!`,
    data: result.contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;
  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY' === 'true')) {
      photoUrl = await saveFileToUploadDir(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const result = await updateContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });
  if (!result) {
    next(createHttpError(404, 'Contact not Found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully updated contact!',
    data: result.contact,
  });
};

export const requestResetEmailController = async (req, res) => {
  await AuthService.requestResetToken(req.body.email);
  res.status(200).json({
    message: 'Reset password email sent successfully',
  });
};
