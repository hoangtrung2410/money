const db = require('../models');
const {Op} = require('sequelize');
const Yup = require('yup');
const User = db.user;
const signUpSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required().test(
      'is-gmail',
      'Email must be a Gmail address',
      (value) => {
        if (value) {
          return value.endsWith('@gmail.com');
        }
        return false;
      }
    ),
    password: Yup.string().required().min(8),
  });
}

const signUp = async (req, res) => {
  try {
    try {
      await signUpSchema().validate(req.body, {abortEarly: false});
    } catch (e) {
      console.error(e)
      return res.status(400).json({
        statusCode: 400,
        message: "Bad Request",
        error: e.errors
      });
    }
    const {name, email, password} = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          {email: email},
        ],
      },
    });
    if (existingUser) {
      console.log("existingUser", existingUser.id);
      return res.status(400).json({
        statusCode: 400,
        message: "Bad Request",
        error: "User already exits"
      });
    }
    const user = await User.create({
      name,
      email,
      password
    });
    return res.status(201).json({
      statusCode: 201,
      message: "Created",
      data: user
    });
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      statusCode: 500,
      error: e?.errors||e?.message
    });
  }
};
const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      statusCode: 200,
      message: "OK",
      data: users
    });
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      statusCode: 500,
      error: e?.errors||e?.message
    });
  }
};

module.exports = {
  signUp,
  getAllUser
};