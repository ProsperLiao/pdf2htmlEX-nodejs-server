'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pdf2HtmlConversions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      originFileName: {
        type: Sequelize.STRING
      },
      filePath: {
        type: Sequelize.STRING
      },
      convertedFilePath: {
        type: Sequelize.STRING
      },
      splitPage: {
        type: {
          types: Sequelize.BOOLEAN,
          defaultValue: true
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "done", "cancelled", "converting"],
        defaultValue: "pending"
      },
      current: Sequelize.INTEGER,
      total: Sequelize.INTEGER,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('Pdf2HtmlConversions');
  }
};