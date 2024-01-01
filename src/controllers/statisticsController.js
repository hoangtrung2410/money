const db = require('../models');
const {Op} = require('sequelize');
const Yup = require('yup');
const Expense = db.expense;
const Revenue = db.revenue;

const getOneToDay = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    console.log(formattedDate);

    const expenses = await Expense.findAll({
      where: {
        time: formattedDate,
        userId: userId
      }
    });

    const totalPrice = expenses.reduce((total, currentExpense) => {
      return total + currentExpense.price;
    }, 0);

    const revenues = await Revenue.findAll({
      where: {
        time: formattedDate,
        userId: userId
      }
    });

    console.log(revenues);

    const totalAmount = revenues.reduce((total, currentRevenue) => {
      return total + currentRevenue.amount;
    }, 0);

    return res.status(200).json({
      statusCode: 200,
      message: "OK",
      data: {
        totalPrice,
        totalAmount
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: e.message // Use e.message instead of e.errors
    });
  }
};

const getOneToYear = async (req, res) => {
  try {
    const userId = req.user.id;
    const {year,month} = req.body;

    // Filter expenses by year
    const expenses = await Expense.findAll({
      where: {
        userId: userId,
        time: {
          [Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
        },
      },
    });

    const revenues = await Revenue.findAll({
      where: {
        userId: userId,
        time: {
          [Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
        },
      },
    });

    let totalPrice = 0;
    let totalAmount = 0;
    expenses.forEach((expense) => {
      totalPrice += expense.price;
    });
    revenues.forEach((revenue) => {
      totalAmount += revenue.amount;
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'OK',
      data: {
        totalPrice,
        totalAmount,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
const getOneToMonthYear = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.body;

    // Validate inputs
    if (!userId || !year || !month) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Bad Request',
        error: 'User ID, year, and month are required.',
      });
    }

    // Calculate the start and end dates for the month
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch expenses and revenues
    const expenses = await Expense.findAll({
      where: {
        userId: userId,
        time: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const revenues = await Revenue.findAll({
      where: {
        userId: userId,
        time: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Calculate total price and total amount
    const totalPrice = expenses.reduce((total, expense) => total + expense.price, 0);
    const totalAmount = revenues.reduce((total, revenue) => total + revenue.amount, 0);

    // Send JSON response
    return res.status(200).json({
      statusCode: 200,
      message: 'OK',
      data: {
        totalPrice,
        totalAmount,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


module.exports = {
  getOneToDay,
  getOneToYear,
  getOneToMonthYear
}
