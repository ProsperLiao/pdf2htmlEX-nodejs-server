/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model, Sequelize } from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Pdf2HtmlConversion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @param { Model[] } models  sql的数据模型
     */
    static associate(models: Model[]) {
      // define association here
    }
  }

  Pdf2HtmlConversion.init(
    {
      originFileName: DataTypes.STRING,
      originFileSize: DataTypes.STRING,
      filePath: DataTypes.STRING,
      convertedFilePath: DataTypes.STRING,
      zipFilePath: DataTypes.STRING,
      splitPages: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'done', 'cancelled', 'converting', 'uploaded', 'zipping'),
        defaultValue: 'uploaded',
      },
      current: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      convertDuration: DataTypes.INTEGER,
      job_id: DataTypes.INTEGER,
      creator_id: DataTypes.INTEGER,
      creator_username: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Pdf2HtmlConversion',
    },
  );

  return Pdf2HtmlConversion;
};
