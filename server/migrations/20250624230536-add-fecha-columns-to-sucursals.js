'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sucursales', 'fechaCreacion', {
      type: Sequelize.DATE,
      allowNull: true // permitir valores nulos inicialmente
    });

    await queryInterface.addColumn('sucursales', 'fechaActualizacion', {
      type: Sequelize.DATE,
      allowNull: true // permitir valores nulos
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sucursales', 'fechaCreacion');
    await queryInterface.removeColumn('sucursales', 'fechaActualizacion');
  }
};
