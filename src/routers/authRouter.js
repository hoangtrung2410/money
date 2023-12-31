const authController = require("../controllers/authController.js")
const authMiddleware = require("../middlerwares/authMiddlerware.js")
const router = require('express').Router()


// router dùng để đăng nhập tài khoản
router.post('/login', authController.login)
// router dùng để đăng xuất tài khoản
router.get('/logout', authMiddleware.authMiddleware, authController.logout)
// router dùng để quên mật khẩu
router.post('/forgotPassword', authController.forgotPassword)
// router dùng để kiểm tra mã code
router.post('/checkCode', authController.checkCode)
// router dùng để reset mật khẩu
router.put('/resetPassword', authController.resetPassword)

module.exports = router