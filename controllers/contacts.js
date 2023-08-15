const contacts = require('../models/contacts');
const { httpError, ctrlWrapper } = require('../helpers/');


//------ HTTP-запити ----------------------------------------------------------------------------------------
  const listContacts = async (req, res) => {
    const result = await contacts.listContacts();
    res.json(result);
  }

  const getContactById = async (req, res) => {
    const {contactId} = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) { throw httpError(404, "Not found"); }
    res.json(result);
  }

  const addContact = async (req, res) => {
    const {name, email, phone} = req.body;
    const result = await contacts.addContact(name, email, phone);
    if (!result) { throw httpError(400, `Error! Contact with the namen [${name}] is elready in the list`); }
    res.status(201).json(result);
  }

  const  updateContact = async (req, res) => {

    console.log("req.body = ", req.body); 
    if (Object.keys(req.body).length === 0) { throw httpError(400, "missing fields"); }

    const {contactId} = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) { throw httpError(404,"Not found"); }
    res.json(result);
  }

  const removeContact = async (req, res) => {
    const {contactId} = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) { throw httpError(404, "Not found"); }
    res.json({ message : "contact deleted" });
  } 
//---------------------------------------------------------------------------------------------------------

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  removeContact: ctrlWrapper(removeContact),
}