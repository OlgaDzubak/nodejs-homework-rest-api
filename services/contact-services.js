const Contact = require('../db/models/contact_model');

const getContacts = async () => {
   const data =  await Contact.find({});
   return data;
}

const getContactById = async(id) => {
    const data = await Contact.find({id,})
    return data;
}

const deleteContact = async (id) => {
    const data =  await Contact.findByIdAndDelete(id);
    return data;
}

const addContact = async (contact) => {
    const data =  await Contact.create(contact);
    return data;
}

const updateById  = async(id, body) =>{
    const data =  await Contact.findByIdAndUpdate(id, body);
    return data;
}

const updateStatusContact  = async(id, body) => {
    const data =  await Contact.findByIdAndUpdate(id, { "favorite": body["favorite"], });
    return data;
}


module.exports = { getContacts, deleteContact, addContact, updateStatusContact };