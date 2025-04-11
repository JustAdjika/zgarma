'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('bugFixes', 'content', {
      type: Sequelize.STRING(2000),  // Увеличиваем длину до 100 символов
    });

    await queryInterface.changeColumn('posts', 'content', {
      type: Sequelize.STRING(2000),  // Увеличиваем длину до 100 символов
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
