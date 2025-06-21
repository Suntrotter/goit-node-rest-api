import Contact from "../db/contacts.js";

async function listContacts() {
  const contactsList = await Contact.findAll();
  return contactsList;
}

async function getContactById(id) {
  const contact = await Contact.findByPk(id);
  return contact || null;
}

async function removeContact(id) {
  const contact = await getContactById(id);
  if (!contact) return null;
  contact.destroy();
  return contact;
}

async function addContact(name, email, phone) {
  const newContact = await Contact.create({ name, email, phone });
  return newContact;
}

async function changeContact(id, updateData) {
  const contact = await getContactById(id);
  if (!contact) return null;
  contact.update(updateData);
  return contact;
}

async function changeFavorite(id, updateData) {
  const contact = await getContactById(id);
  if (!contact) return null;
  contact.update(updateData);
  return contact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact,
  changeFavorite,
};