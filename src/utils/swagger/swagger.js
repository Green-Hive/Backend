const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Green Hive API',
        description: 'Description'
    },
    host: 'localhost:4000',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const routes = ['./src/app.ts'];

swaggerAutogen(outputFile, routes, doc);