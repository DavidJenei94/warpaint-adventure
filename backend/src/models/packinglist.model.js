const getPackingListModel = (sequelize, { DataTypes }) => {
  const PackingList = sequelize.define('PackingList', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(127),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  PackingList.associate = (models) => {
    PackingList.belongsTo(models.User, { foreignKey: 'userId' });
    PackingList.hasMany(models.PackingItem, {
      foreignKey: 'packingListId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return PackingList;
};

module.exports = getPackingListModel;
