import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact,
  changeFavorite,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const getAllContacts = async (_, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};

const getOneContact = async (req, res, next) => {
  const id = req.params.id;
  const contactById = await getContactById(id);
  if (!contactById) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(contactById);
};

const deleteContact = async (req, res, next) => {
  const id = req.params.id;
  const deletedContact = await removeContact(id);
  if (!deletedContact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(deletedContact);
};

const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const newContact = await addContact(name, email, phone);
  res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, "Body must have at least one field");
  const updatedContact = await changeContact(id, { name, email, phone });

  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(updatedContact);
};

const updateFavorite = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, "Body must have at least field 'favorite'");
  const updatedFavorite = await changeFavorite(id, { favorite });

  if (!updatedFavorite) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(updatedFavorite);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};