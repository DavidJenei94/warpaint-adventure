const getRouteModel = (sequelize, { DataTypes }) => {
  const Route = sequelize.define('Route', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(63),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(15),
      defaultValue: 'blue',
      allowNull: false,
    },
  });

  Route.associate = (models) => {
    Route.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Route;
};

module.exports = getRouteModel;
