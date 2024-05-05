import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Green Hive API',
    description: 'Description',
  },
  host: 'greenhiveapi.up.railway.app',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const routes = ['./src/app.ts'];

swaggerAutogen(outputFile, routes, doc);
