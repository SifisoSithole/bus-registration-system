const route = require("./route");

module.exports = (sequelize, DataTypes) => {
  const DropOff = sequelize.define(
    "DropOff",
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
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      route_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "routes",
          key: "id",
        },
      },
    },
    { tableName: "drop_offs" }
  );

  DropOff.associate = (models) => {
    DropOff.belongsTo(models.Route, { foreignKey: "route_id", as: "route" });
    DropOff.belongsTo(models.Station, {
      foreignKey: "station_id",
      as: "station",
    });
  };

  return DropOff;
};
