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
      originFileSize: {
        type: Sequelize.STRING
      },
      filePath: {
        type: Sequelize.STRING
      },
      convertedFilePath: {
        type: Sequelize.STRING
      },
      zipFilePath: {
        type: Sequelize.STRING
      },
      splitPages: {
        type: {
          types: Sequelize.BOOLEAN,
          defaultValue: true
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "done", "cancelled", "converting", "uploaded"],
        defaultValue: "uploaded"
      },
      current: Sequelize.INTEGER,
      total: Sequelize.INTEGER,
      convertDuration: Sequelize.INTEGER,
      creator_id:  {
        type: Sequelize.INTEGER
      },
      creator_username: {
        type: Sequelize.STRING
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
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('Pdf2HtmlConversions');
  }
};
