

/* 
    Created By : BARSHAN
    Created On : 02/11/2021
    Description: Model for tagMaster
*/


const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const tagMaster = sequelize.define('tag_master', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id',
      autoIncrement: true
    },
    tag_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      field: 'tag_name'
    },

  }, { schema: 'public', underscored: true, tableName: 'tag_master', timestamps: false });
  return tagMaster;
};