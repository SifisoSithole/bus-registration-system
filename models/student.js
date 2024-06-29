module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "parents",
          key: "id",
        },
      },
    },
    { tableName: "students" }
  );

  Student.associate = (models) => {
    Student.belongsTo(models.Parent, { foreignKey: "parent_id", as: "parent" });
    Student.hasOne(models.WaitingList, {
      foreignKey: "student_id",
      as: "waitingList",
      onDelete: "CASCADE",
    });
    Student.hasOne(models.AssignedStudents, {
      foreignKey: "student_id",
      as: "assignedStudents",
      onDelete: "CASCADE",
    });
  };

  return Student;
};
