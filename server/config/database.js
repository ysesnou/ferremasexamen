const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = require('./config.json');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: false,
    dialectOptions: {
      dateStrings: true,  // <-- Añade esto
      typeCast: true,     // <-- Añade esto
      timezone: '-04:00'  // <-- Ajusta según tu zona horaria (Chile)
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: false,    // <-- Opcional para soft deletes
      freezeTableName: true // <-- Evita pluralización automática
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '-04:00' // <-- Zona horaria para Sequelize
  }
);

// Función de conexión mejorada
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    // Sincronización segura con manejo de errores
    await sequelize.sync({ 
      alter: true,
      hooks: true,
      logging: console.log // Muestra las consultas SQL ejecutadas
    });
    console.log('🔄 Modelos sincronizados (alter)');
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error);
    // Manejo específico para errores de fecha
    if (error.original && error.original.code === 'ER_TRUNCATED_WRONG_VALUE') {
      console.error('💡 Solución: Ejecuta la migración de corrección de fechas');
    }
  }
}

// Ejecutar con manejo de errores
testConnection();

module.exports = sequelize;