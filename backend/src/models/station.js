module.exports = (sequelize, DataTypes) => {
  const Station = sequelize.define(
    "Station",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: "stations" }
  );

  Station.associate = (models) => {
    Station.hasMany(models.PickUp, { foreignKey: "station_id", as: "pickups" });
    Station.hasMany(models.DropOff, {
      foreignKey: "station_id",
      as: "dropoffs",
    });
  };

  return Station;
};
