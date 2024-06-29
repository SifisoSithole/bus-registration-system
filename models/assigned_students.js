module.exports = (sequelize, DataTypes) => {
  const AssignedStudents = sequelize.define(
    "AssignedStudents",
    {
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
      assigned_on: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { tableName: "assigned_students" }
  );

  AssignedStudents.associate = (models) => {
    AssignedStudents.belongsTo(models.Student, {
      foreignKey: "student_id",
      as: "student",
    });
    AssignedStudents.belongsTo(models.Bus, { foreignKey: "bus_id", as: "bus" });
  };

  return AssignedStudents;
};
