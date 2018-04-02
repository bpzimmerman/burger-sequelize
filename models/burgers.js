module.exports = function(sequelize, DataTypes) {
  var Burger = sequelize.define("Burger", {
    burger_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  });

  Burger.associate = function(models) {
    Burger.hasMany(models.Link, {
      onDelete: "cascade"
    });
  };

  return Burger;
};