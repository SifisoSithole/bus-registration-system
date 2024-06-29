module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define(
    "Route",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      route_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "buses",
          key: "id",
        },
      },
    },
    { tableName: "routes" }
  );

  Route.associate = (models) => {
    Route.belongsTo(models.Bus, { foreignKey: "bus_id", as: "bus" });
    Route.hasMany(models.PickUp, { foreignKey: "pick_up_id", as: "pickUp" });
    Route.hasMany(models.DropOff, { foreignKey: "drop_off_id", as: "dropOff" });
  };

  return Route;
};
