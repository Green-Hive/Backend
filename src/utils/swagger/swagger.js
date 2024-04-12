import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Green Hive API',
        description: 'Description'
    },
    host: '127.0.0.1:4000',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const routes = ['./src/app.ts'];

swaggerAutogen(outputFile, routes, doc);