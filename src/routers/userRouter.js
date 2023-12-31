const userController = require("../controllers/userController.js")
const authMiddleware = require("../middlerwares/authMiddlerware.js")

const router = require('express').Router()

// router dùng để đăng kí tài khoản
router.post('/', userController.signUp)



module.exports = router