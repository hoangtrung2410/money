
module.exports = (sequelize, DataTypes) => {
  const Revenue = sequelize.define("revenue",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING
      },
      amount: {
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
  return Revenue
}
