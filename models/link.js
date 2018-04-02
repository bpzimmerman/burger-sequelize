module.exports = function(sequelize, DataTypes) {
  var Link = sequelize.define("Link", {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  Link.associate = function(models) {
    Link.belongsTo(models.Burger, {
      foreignKey: {
        allowNull: false
      }
    });
    Link.belongsTo(models.Diner, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Link;
};