module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define("Parent", {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Parent.associate = (models) => {
    console.log(models.Student);
    Parent.hasMany(models.Student, {
      foreignKey: "parent_id",
      as: "students",
      onDelete: "CASCADE",
    });
  };

  return Parent;
};
