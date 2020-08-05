/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model, Sequelize } from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @param models
     */
    static associate(models: Model[]) {
      // define association here
    }
  }
  RefreshToken.init(
    {
      username: DataTypes.STRING,
      userid: DataTypes.INTEGER,
      refreshToken: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'RefreshToken',
    },
  );
  return RefreshToken;
};
