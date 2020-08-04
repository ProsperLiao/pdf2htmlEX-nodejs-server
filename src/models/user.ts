/* eslint-disable @typescript-eslint/no-unused-vars */
import Role from '../utils/role';

import { Model, Sequelize } from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @param  { Model[] } models models
     */
    static associate(models: Model[]) {
      // define association here
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM(Role.Admin, Role.User),
        defaultValue: Role.User,
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
};
