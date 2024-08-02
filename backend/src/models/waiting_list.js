module.exports = (sequelize, DataTypes) => {
  const WaitingList = sequelize.define(
    "WaitingList",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
      },
      bus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "buses",
          key: "id",
        },
      },
      waiting_since: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reason_for_waiting: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: "waiting_list" }
  );

  WaitingList.associate = (models) => {
    WaitingList.belongsTo(models.Student, {
      foreignKey: "student_id",
      as: "student",
    });
    WaitingList.belongsTo(models.Bus, { foreignKey: "bus_id", as: "bus" });
  };

  return WaitingList;
};
