// const {ControlTower} = require("aws-sdk")
const adminsController = require("../controllers/adminController.js")
const authMiddleware = require("../middlerwares/authMiddlerware.js")

const router = require('express').Router()


router.post('/register', adminsController.registerAdmins)

router.post('/login', adminsController.loginAdmins)

router.get('/logout', authMiddleware.authAdminMiddleware, adminsController.logoutAdmins)

router.put('/changePassword',authMiddleware.authAdminMiddleware , adminsController.updatePassword)

router.put('/updateUser/:id', authMiddleware.authAdminMiddleware, adminsController.updateUser)

router.get('/allUser', authMiddleware.authAdminMiddleware, adminsController.getAllUsers)

router.post('/allUserByUsername',authMiddleware.authAdminMiddleware, adminsController.getUserByUsername)

router.post('/allUserByEmail', authMiddleware.authAdminMiddleware, adminsController.getUserByEmail)

router.post('/allByEmailUserName',authMiddleware.authAdminMiddleware, adminsController.getUserByEmailAndUsername)

router.delete('/deleteUser/:id', authMiddleware.authAdminMiddleware, adminsController.deleteUser)




module.exports = router