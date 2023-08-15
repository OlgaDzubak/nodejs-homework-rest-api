const fs = require('fs/promises');
const {v4} = require("uuid");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");

// ФУНКЦІЇ ДЛЯ РОБОТИ С JSON-ФАЙЛОМ ( імітація бази данних ) ====================================================

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
    const result = contacts.find(contact => contact.id === contactId)
    if (!result) return null;
    return result;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
     const index = contacts.findIndex(contact => contact.id === contactId);
     if (index === -1) return null;
     const removeContact = contacts.splice(index, 1)[0];
     await fs.writeFile(contactsPath, JSON.stringify(contacts));
     return removeContact;
}

const addContact = async (name, email, phone) => {
  const contacts = await listContacts();
    if (contacts.findIndex(contact => contact.name === name) != -1){
        return null;
    }
    const newContact = { id: v4(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
}

const  updateContact = async (contactId, body) => {
  const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    contacts[index] = {id: contactId, ...body,}; 
    await fs.writeFile(contactsPath, JSON.stringify(contacts)); 
    return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
