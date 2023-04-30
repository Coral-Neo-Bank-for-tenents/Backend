const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

//@desc get all contacts
//@route GET /api/contact
//@access private
const getContacts = asyncHandler(async(req, res) => {
    
    const contacts = await Contact.find({user_id: req.user.id});
    // console.log(contacts);
    
    res.status(200).json(contacts);
})


//@desc create new contacts
//@route POST /api/contact
//@access private
const createContact = asyncHandler(async(req, res) => {
    console.log("request body is", req.body)

    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All feilds are mandatory");
    }

    const contact = await Contact.create({
        name,
        email, 
        phone, 
        user_id: req.user.id
    });

    res.status(201).json({
        message: contact,
    });
})


//@desc get contact
//@route GET /api/contact/:id
//@access private
const getContact = asyncHandler(async(req, res) => {

    const contact = await Contact.findById(req.params.id);
    // console.log('contact = ', contact);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }

    res.status(200).json({
        message: contact,
    });
})


//@desc update contact
//@route PUT /api/contact/:id
//@access private
const updateContact = asyncHandler(async(req, res) => {

    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("user don't have permission to update other person contact")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );

    res.status(200).json(updatedContact);
})


//@desc delete contact
//@route DELETE /api/contact/:id
//@access private
const deleteContact = asyncHandler(async(req, res) => {

    const contact = await Contact.findById(req.params.id);
    console.log('contact = ', contact)
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("user don't have permission to delete other person contact")
    }

    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
})



module.exports = {getContacts, createContact, getContact, updateContact, deleteContact};