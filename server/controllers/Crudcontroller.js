 const UserModel = require('../Models/user-schema')
const bcrypt  = require ('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();

const Crudcre = async (req, res) => {

  try {
    const { name, email, password} = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User exist", succes: false });
    }
    const userModel = new UserModel({ name, email, password});
    userModel.password = await bcrypt.hash(password, 10);

    await userModel.save();
    res.status(201).json({
      message: "signup successful",
      success: true,

    });

  } 
  
  catch (error) {
    return res.status(500).json({
      message: "signup failed",
      success: true,
    });
  }
};

module.exports =  { Crudcre };
