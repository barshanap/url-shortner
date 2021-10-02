
/* 
    Created By : BARSHAN
    Created On : 02/11/2021
    Description: Model for urlTagDetails
*/

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const urlTagDetails = sequelize.define('url_tag_details', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id',
      autoIncrement: true
    },
    url_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'url_id'
    },
    tag_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'tag_id'
    },


  }, { schema: 'public', underscored: true, tableName: 'url_tag_details', timestamps: false });
  return urlTagDetails;
};