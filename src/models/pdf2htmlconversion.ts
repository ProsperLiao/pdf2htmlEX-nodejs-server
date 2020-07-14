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
      console.log(models);
    }
  }

  Pdf2HtmlConversion.init(
    {
      filePath: DataTypes.STRING,
      convertedFilePath: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('pending', 'done', 'cancelled'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Pdf2HtmlConversion',
    },
  );

  return Pdf2HtmlConversion;
};
