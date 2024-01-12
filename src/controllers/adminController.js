const db = require('../models')
const jwt = require('jsonwebtoken');
const Admins = db.admin
const User = db.user;
const JwtService = require("../services/jwtServices.js");
const {Op} = require('sequelize');
const Post = db.post;

const registerAdmins = async (req, res) => {
  try {

    const inf = {
      userName: req.body.userName,
      passWord: req.body.passWord,
      fullName: req.body.fullName,
      email: req.body.email
    }
    if (!req.body) {
      return res.status(400).json({
        message: "Bad request"
      })
    }
    console.log(inf)
    const checkAdmin = await Admins.findOne({where: {email: inf.email}})
    if (checkAdmin) {
      return res.status(401).json({
        statusCode: 401,
        message: "Amin already exists"
      }
      )
    }
    const admin = await Admins.create(inf)
    console.log(admin)
    return res.status(201).json({
      statusCode: 201,
      message: "Created",
      admin
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal Server Error"});
  }
};
const loginAdmins = async (req, res) => {
  try {
    const {email, passWord} = req.body;
    if(!email || !passWord){
      return res.status(400).json({
        statusCode: 400,
        message: "Missing email or password",
      });
    }
    const admin = await Admins.findOne({where: {email:req.body.email}});
    if (!admin) {
      return res.status(401).json({
        message:'Incorrect UserName or PassWord'
      });
    }
    const token =JwtService.jwtSign({admin}, {expiresIn: '100h'});
    return res.json({
      statusCode: 200,
      admin,
      token,
      message: 'Login Success'});
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error"
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const id = req.admin.id;
    console.log("11312312>>>> " +id);
    const {oldPassword, newPassword} = req.body;
    const admin = await Admins.findByPk(id);
    if (admin.passWord !== oldPassword) {
      res.status(401).json({error: "Mật khẩu cũ không đúng"});
      return;
    }
    const [updatedRowsCount]= await Admins.update(
        {passWord: newPassword},
        {where: {id: id}, returning: true}
      );
    if (updatedRowsCount === 0) {
        res.status(404).json({error: "Cập nhật mật khẩu không thành công"});
        return;
    }
      res.status(200).json({message: "Thay đổi mật khẩu thành công"});
  } catch (error) {
    res.status(500).json({error: "Internal Server Error"});
  }
}
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(
      users
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

// Find user by username
const getUserByUsername = async (req, res) => {
  const {username} = req.body;
  try {
    const user = await User.findAll({where: {name: username}});
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

// Find user by email
const getUserByEmail = async (req, res) => {
  const {email} = req.body;

  try {
    const user = await User.findAll({where: {email}});

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};


const getUserByEmailAndUsername = async (req, res) => {
  const {email, username} = req.body;

  try {
    const user = await User.findAll({where: {email, name: username}});

    if (user.length) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const [updatedRows] = await User.update(req.body, {where: {id: id}});
    if (updatedRows === 0) {
      return res.status(404).json({error: 'User not found'});
    }

    return res.status(200).json('Cập nhật thành công');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({error: 'Internal Server Error'});
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRows = await User.destroy({where: {id: id}});
    if (deletedRows === 0) {
      return res.status(404).json({error: 'User not found'});
    }
    res.status(200).json('Xóa thành công User');

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({error: 'Internal Server Error'});
  }
};
const logoutAdmins = async (req, res) => {
  try {
    // JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));
    res.status(200).json({
      statusCode: 200,
      message: "Log out successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      statusCode: 500,
      error: e?.errors || e?.message
    });

  }
}


module.exports = {
  registerAdmins,
  loginAdmins,
  updatePassword,
  getAllUsers,
  getUserByUsername,
  getUserByEmail,
  getUserByEmailAndUsername,
  updateUser,
  deleteUser,
  logoutAdmins


}
