
module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define("expense",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.INTEGER
      },
      time: {
        type: DataTypes.DATEONLY
      }
    },
    {
      timestamps: true,
    }
  )
  return Expense
}
