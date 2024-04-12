import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Green Hive API',
        description: 'Description'
    },
    host: 'backend-production-3c19.up.railway.app', // Use the host from DATABASE_URL
    schemes: ['http', 'https'], // Support both HTTP and HTTPS
};

const outputFile = './swagger.json';
const routes = ['./src/app.ts'];

swaggerAutogen(outputFile, routes, doc);