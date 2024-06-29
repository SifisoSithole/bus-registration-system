module.exports = (sequelize, DataTypes) => {
  const Bus = sequelize.define(
    "Bus",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bus_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: "buses" }
  );

  Bus.associate = (models) => {
    Bus.hasOne(models.Route, { foreignKey: "route_id", as: "route" });
    Bus.hasMany(models.AssignedStudents, {
      foreignKey: "bus_id",
      as: "assignedStudents",
    });
    Bus.hasMany(models.WaitingList, {
      foreignKey: "bus_id",
      as: "waitingList",
    });
  };

  return Bus;
};
