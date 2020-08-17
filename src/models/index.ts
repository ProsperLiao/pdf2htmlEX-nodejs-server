import { DataTypes, Sequelize } from 'sequelize';

import fs from 'fs';
import path from 'path';

const basename = path.basename(__filename),
  env = process.env.NODE_ENV || 'development',
  config = require(path.resolve(__dirname, '../database/config/config.json'))[env],
  db: any = {},
  sequelize = new Sequelize({ ...config, storage: path.resolve(__dirname, '../database', config.storage) });

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === (env === 'production' ? '.js' : '.ts');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export = db;
