const dbConfig = require('../config/dbConfig.js')
const {Sequelize, DataTypes} = require('sequelize');



const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
)
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')

  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize


db.user = require('./user.js')(sequelize, DataTypes)
db.expense = require('./expense.js')(sequelize, DataTypes)
db.revenue = require('./revenue.js')(sequelize, DataTypes)
db.admin = require('./admin.js')(sequelize, DataTypes)


db.sequelize.sync({force: false})
  .then(async () => {
    console.log('yes re-sync done!')
  })
  .catch(err => {
    console.log(err)
  })

//
db.user.hasMany(db.expense, {foreignKey: 'userId',onDelete: 'cascade', onUpdate: 'cascade'})
db.user.hasMany(db.revenue, {foreignKey: 'userId',onDelete: 'cascade', onUpdate: 'cascade'})
db.expense.belongsTo(db.user, {foreignKey: 'userId',onDelete: 'cascade', onUpdate: 'cascade'})
db.revenue.belongsTo(db.user, {foreignKey: 'userId',onDelete: 'cascade', onUpdate: 'cascade'})






module.exports = db