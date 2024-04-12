import swaggerAutogen from 'swagger-autogen';

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
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9792890a-3f0e-5930-a62a-9b5707eb2b62")}catch(e){}}();
//# debugId=9792890a-3f0e-5930-a62a-9b5707eb2b62
