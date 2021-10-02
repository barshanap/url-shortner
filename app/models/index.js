
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.CONNECTION_STRING, {
  logging: false,
  "dialect": "postgres",
  "dialectOptions": {
    "ssl": {
      "rejectUnauthorized": false
    }
  }
  
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.urlMaster = require("./urlMaster.js")(sequelize);
db.tagMaster = require("./tagMaster.js")(sequelize);
db.urlTagDetails = require("./urlTagDetails.js")(sequelize);

// urlTagDetails Associations
db.urlTagDetails.belongsTo(db.urlMaster, { foreignKey: 'url_id' });
db.urlTagDetails.belongsTo(db.tagMaster, { foreignKey: 'tag_id' });


module.exports = db;
