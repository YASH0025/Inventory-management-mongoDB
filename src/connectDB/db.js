// db.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:Yash@123@localhost:3306/yourdbname', {
  dialect: 'mysql',
  define: {
    timestamps: false, // Disable Sequelize's automatic timestamp fields
  },
});

module.exports = sequelize;
