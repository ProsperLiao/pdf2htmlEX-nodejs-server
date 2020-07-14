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
      filePath: {
        type: Sequelize.STRING
      },
      convertedFilePath: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "done", "cancelled"],
        defaultValue: "pending"
      },
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pdf2HtmlConversions');
  }
};
