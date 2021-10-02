
/* 
    Created By : BARSHAN
    Created On : 02/11/2021
    Description: Model for urlMaster
*/


const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const urlMaster = sequelize.define('url_master', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id',
      autoIncrement: true
    },
    short_url: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: 'short_url'
    },
    full_url: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: 'full_url'
    },
    url_code: {
      type: Sequelize.STRING(50),
      allowNull: false,
      field: 'url_code'
    },
  }, { schema: 'public', underscored: true, tableName: 'url_master', timestamps: false });
  return urlMaster;
};