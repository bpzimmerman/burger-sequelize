module.exports = function(sequelize, DataTypes) {
  var Diner = sequelize.define("Diner", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  });

  Diner.associate = function(models) {
    Diner.hasMany(models.Link, {
      onDelete: "cascade"
    });
  };

  return Diner;
};