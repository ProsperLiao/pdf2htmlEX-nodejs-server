'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pdf2HtmlConversion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Pdf2HtmlConversion.init({
    filePath: DataTypes.STRING,
    convertedFilePath: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("pending", "done", "cancelled"),
      defaultValue: "pending"
    }
  }, {
    sequelize,
    modelName: 'Pdf2HtmlConversion',
  });
  return Pdf2HtmlConversion;
};
