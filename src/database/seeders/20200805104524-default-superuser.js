'use strict';

const bcrypt = require('bcrypt');
const path = require('path');
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  require('dotenv').config({path: path.resolve('../../.env')});
} else {
  require('dotenv').config({path: path.resolve('../../.env.dev')});
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const password = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || '', 10);
    return await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password,
        desc: 'default admin account',
        role: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  },
};
