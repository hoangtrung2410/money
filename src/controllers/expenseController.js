const db = require('../models');
const {Op} = require('sequelize');
const Yup = require('yup');
const Expense = db.expense;


const addExpenseSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required(),
    price: Yup.number().required(),
    time: Yup.date().required(),
  });
}


const addExpense = async (req, res) => {
  try{
    const userId = req.user.id;
    console.log("userId = ", userId);
    try {
      await addExpenseSchema().validate(req.body, {abortEarly: false});
    } catch (e) {
      console.error(e)
      return res.status(400).json({
        statusCode: 400,
        message: "Bad Request",
        error: e.errors
      });
    }
    const {name, price, time} = req.body;
    const expense = await Expense.create({
      name,
      price,
      time,
      userId
    });
    return res.status(201).json({
      statusCode: 201,
      message: "Created",
      data: expense
    });
  }catch (e) {
    console.error('Error:', e);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: e.errors
    });
  }
}
const getAllExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expense = await Expense.findAll({
      where: {
        userId: userId
      },
      // thoi gian giam dan
      order: [
        ['time', 'DESC']
      ]
    });
    if(expense.length === 0){
      return res.status(404).json({
        statusCode: 404,
        message: "Not Found",
        error: 'Expense not found'
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "OK",
      data: expense
    });
  } catch (e) {
    console.error('Error:', e);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: e.errors
    });
  }
}
const getExpenseById = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.expenseId;
    const expense = await Expense.findOne({
      where: {
        id: expenseId,
        userId: userId
      }
    });
    if (!expense) {
      return res.status(404).json({
        statusCode: 404,
        message: "Not Found",
        error: 'Expense not found'
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "OK",
      data: expense
    });
  } catch (e) {
    console.error('Error:', e);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: e.errors
    });
  }
}
const updateExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.expenseId;
    const expense = await Expense.findOne({
      where: {
        id: expenseId,
        userId: userId
      }
    });
    if (!expense) {
      return res.status(404).json({
        statusCode: 404,
        message: "Not Found",
        error: 'Expense not found'
      });
    }
    await expense.update(req.body);
    return res.status(200).json({
      statusCode: 200,
      message: "Updated",
      data: expense
    });
  } catch (e) {
    console.error('Error:', e);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: e.errors
    });
  }
}
const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.expenseId;
    const expense = await Expense.findOne({
      where: {
        id: expenseId,
        userId: userId
      }
    });
    if (!expense) {
      return res.status(404).json({
        statusCode: 404,
        message: "Not Found",
        error: 'Expense not found'
      });
    }
    await expense.destroy();
    return res.status(200).json({
      statusCode: 200,
      message: "Deleted",
    });
  } catch (e) {
    console.error('Error:', e);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: e.errors
    });
  }
}
module.exports = {
  addExpense,
  getAllExpense,
  getExpenseById,
  updateExpense,
  deleteExpense
}

