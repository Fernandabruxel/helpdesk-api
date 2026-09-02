require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HelpDesk API',
      version: '1.0.0',
      description: 'API REST do Sistema de Gestao de Chamados e Suporte Tecnico (HelpDesk).'
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 4000}`, description: 'Ambiente local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;