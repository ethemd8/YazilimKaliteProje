const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test için ayrı pool
// GitHub Actions'da DB_NAME zaten _test ile geliyor, local'de ise _test ekliyoruz
const getTestDatabaseName = () => {
  const dbName = process.env.DB_NAME || 'yazilim_kalite_db';
  return dbName.endsWith('_test') ? dbName : dbName + '_test';
};

const testDatabaseName = getTestDatabaseName();

const testPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: testDatabaseName,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Veritabanı bağlantısını test et
pool.on('connect', () => {
  console.log('PostgreSQL veritabanına bağlandı');
});

pool.on('error', (err) => {
  console.error('PostgreSQL bağlantı hatası:', err);
});

module.exports = {
  pool: process.env.NODE_ENV === 'test' ? testPool : pool,
  query: (text, params) => (process.env.NODE_ENV === 'test' ? testPool : pool).query(text, params),
};
