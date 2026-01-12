const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Ticaret REST API',
      version: '1.0.0',
      description: 'Yazılım Kalite Güvencesi ve Test Projesi - E-Ticaret REST API Dokümantasyonu',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Users', description: 'Kullanıcı işlemleri' },
      { name: 'Categories', description: 'Kategori işlemleri' },
      { name: 'Products', description: 'Ürün işlemleri' },
      { name: 'Orders', description: 'Sipariş işlemleri' },
      { name: 'Reviews', description: 'Yorum işlemleri' },
    ],
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
