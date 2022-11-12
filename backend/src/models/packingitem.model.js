const getPackingItemModel = (sequelize, { DataTypes }) => {
  const PackingItem = sequelize.define('PackingItem', {
    packingListId: {
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
    status: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
      allowNull: false,
    },
  });

  PackingItem.associate = (models) => {
    PackingItem.belongsTo(models.PackingList, { foreignKey: 'packingListId' });
  };

  return PackingItem;
};

module.exports = getPackingItemModel;
