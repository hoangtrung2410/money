const revenueController = require("../controllers/revenueController.js")
const authMiddleware = require("../middlerwares/authMiddlerware.js")

const router = require('express').Router()

router.post('/', authMiddleware.authMiddleware, revenueController.addRevenue)
router.get('/', authMiddleware.authMiddleware, revenueController.getAllRevenue)
router.get('/:revenueId', authMiddleware.authMiddleware, revenueController.getRevenueById)
router.put('/:revenueId', authMiddleware.authMiddleware, revenueController.updateRevenue)
router.delete('/:revenueId', authMiddleware.authMiddleware, revenueController.deleteRevenue)




module.exports = router