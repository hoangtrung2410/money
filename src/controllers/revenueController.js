const db = require('../models');
const {Op} = require('sequelize');
const Yup = require('yup');
const Revenue = db.revenue;


const addRevenueSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required(),
    amount: Yup.number().required(),
    time: Yup.date().required(),
  });
}


const addRevenue = async (req, res) => {
  try{
    const userId = req.user.id;
    try {
      await addRevenueSchema().validate(req.body, {abortEarly: false});
    } catch (e) {
      console.error(e)
      return res.status(400).json({
        statusCode: 400,
        message: "Bad Request",
        error: e.errors
      });
    }
    const {name, amount, time} = req.body;
    const revenue = await Revenue.create({
      name,
      amount,
      time,
      userId
    });
    return res.status(201).json({
      statusCode: 201,
      message: "Created",
      data: revenue
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
const getAllRevenue = async (req, res) => {
  try {
    const userId = req.user.id;
    const revenue = await Revenue.findAll({
      where: {
        userId: userId
      },
      // thoi gian giam dan
      order: [
        ['time', 'DESC']
      ]
    });
    if(revenue.length === 0){
      return res.status(404).json({
        statusCode: 404,
        message: "Not Found",
        error: 'Revenue not found'
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "OK",
      data: revenue
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

const getRevenueById = async (req, res) => {
  try{
    const userId = req.user.id;
    const revenueId = req.params.revenueId;
    const revenue = await Revenue.findOne({
      where: {
        id: revenueId,
        userId: userId
      }
    });
    if(!revenue){
      return res.status(404).json({
        statusCode: 404,
        message: "Not Found",
        error: 'Revenue not found'
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "OK",
      data: revenue
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
const updateRevenue = async (req, res) => {
  try {
    const userId = req.user.id;
    const revenueId = req.params.revenueId;
    const revenue = await Revenue.findOne({
      where: {
        id: revenueId,
        userId: userId
      }
    });
    if (!revenue) {
      return res.status(404).json({
        statusCode: 404,
        message: "Not Found",
        error: 'Revenue not found'
      });
    }
    const {name, amount, time} = req.body;
    await revenue.update({
      name,
      amount,
      time
    });
    return res.status(200).json({
      statusCode: 200,
      message: "Updated",
      data: revenue
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
const deleteRevenue = async (req, res) => {
  try {
    const userId = req.user.id;
    const revenueId = req.params.revenueId;
    const revenue = await Revenue.findOne({
      where: {
        id: revenueId,
        userId: userId
      }
    });
    if (!revenue) {
      return res.status(404).json({
        statusCode: 404,
        message: "Not Found",
        error: 'Revenue not found'
      });
    }
    await revenue.destroy();
    return res.status(200).json({
      statusCode: 200,
      message: "Deleted successfully",
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
  addRevenue,
  getAllRevenue,
  getRevenueById,
  updateRevenue,
  deleteRevenue
}

