module.exports = (sequelize, DataTypes) => {
  const PickUp = sequelize.define(
    "PickUp",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "stations",
          key: "id",
        },
      },
      route_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "routes",
          key: "id",
        },
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    { tableName: "pick_ups" }
  );

  PickUp.associate = (models) => {
    PickUp.belongsTo(models.Route, { foreignKey: "route_id", as: "route" });
    PickUp.belongsTo(models.Station, {
      foreignKey: "station_id",
      as: "station",
    });
  };

  return PickUp;
};
