const expenseController = require("../controllers/expenseController.js")
const authMiddleware = require("../middlerwares/authMiddlerware.js")

const router = require('express').Router()

router.post('/', authMiddleware.authMiddleware, expenseController.addExpense)
router.get('/', authMiddleware.authMiddleware, expenseController.getAllExpense)
router.get('/:expenseId', authMiddleware.authMiddleware, expenseController.getExpenseById)
router.put('/:expenseId', authMiddleware.authMiddleware, expenseController.updateExpense)
router.delete('/:expenseId', authMiddleware.authMiddleware, expenseController.deleteExpense)



module.exports = router