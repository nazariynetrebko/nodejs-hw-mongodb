import { getAllContacts, getContactById } from '../services/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    console.log('Received GET /contacts request');
    const contacts = await getAllContacts();
    console.log('Contacts retrieved:', contacts);
    res.status(200).json({
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
  try {
    console.log(
      'Received GET /contacts/:contactId request with ID:',
      req.params.contactId,
    );
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    console.log('Contact retrieved:', contact);

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  } catch (error) {
    console.error('Error in getContact:', error);
    next(error);
  }
};
