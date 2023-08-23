const {Contact} = require('../db/models/contact_model');
const { httpError, ctrlWrapper } = require('../helpers/');


//------ HTTP-запити ----------------------------------------------------------------------------------------
  const getContacts = async (req, res) => {
    const result = await Contact.find({});
    res.json(result);
  }

  const getContactById = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findById(contactId);
    if (!result) { throw httpError(404, "Not found"); }
    res.json(result);
  }

  const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    if (!result) { throw httpError(400, `Contact with the name '${name}' is elready in the list`); }
    res.status(201).json(result);
  }

  const  updateById = async (req, res) => {
    const {contactId} = req.params;
    const {body} = req.body;
    const result = await Contact.findByIdAndUpdate(contactId, body, {new: true});
    if (!result) { throw httpError(404,"Not found"); }
    res.json(result);
  }

  const removeContact = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) { throw httpError(404, "Not found"); }
    res.json({ message : "contact deleted" });
  } 

  const updateStatusContact = async(req, res)=>{

    const { contactId } = req.params;
    const { favorite  }  = req.body;
   
    if (!Reflect.has(req.body, 'favorite')) { throw httpError(400, "missing field favorite"); };
    const result =  await Contact.findByIdAndUpdate(contactId, { "favorite": favorite }, {new: true});
    if (!result) { throw httpError(404, "Not found"); }
    res.json(result);
  }
//---------------------------------------------------------------------------------------------------------

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateById: ctrlWrapper(updateById),
  removeContact: ctrlWrapper(removeContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
}