const express = require('express');
const cors = require('cors');
require('dotenv').config();
require("express-async-errors");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const app = express()

// Port
const PORT = process.env.PORT || 8686;

// Middleware
app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(cookieParser());

// Routers
const userRouter = require('./src/routers/userRouter.js');
const authRouter = require('./src/routers/authRouter.js');
const revenueRouter = require('./src/routers/revenueRouter.js');
const expenseRouter = require('./src/routers/expenseRouter.js');
const statisticsRouter = require("./src/routers/statisticsRouter.js");
const adminRouter = require("./src/routers/adminRouter.js");



// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/revenues', revenueRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/admin', adminRouter);



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
