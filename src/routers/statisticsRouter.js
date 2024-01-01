const  statisticsController=  require("../controllers/statisticsController.js")
const authMiddleware = require("../middlerwares/authMiddlerware.js")

const router = require('express').Router()


router.get('/today/', authMiddleware.authMiddleware, statisticsController.getOneToDay)
router.post('/month/', authMiddleware.authMiddleware, statisticsController.getOneToMonthYear)
router.post('/year/', authMiddleware.authMiddleware, statisticsController.getOneToYear)




module.exports = router