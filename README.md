# Green Hive Backend API

This repository contains the backend API for managing bee hive data for the Green Hive project.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Alerts API](#alerts-api)
- [License](#license)

## Introduction

The Green Hive Backend API is built to provide functionality for managing bee hive data. It allows users to perform
various operations such as creating, updating, deleting, and retrieving hive data through a RESTful API.

## Features

- **CRUD Operations:** Perform CRUD operations on bee hive data.
- **Prisma ORM:** Uses Prisma ORM for database management.
- **Express.js:** Built with Express.js for handling HTTP requests.
- **Swagger Documentation:** Generates API documentation using Swagger.
- **Testing:** Includes unit tests for API endpoints.

## Installation

To install and run the Green Hive Backend API locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Green-Hive/Backend.git
   cd Backend
   yarn install
   yarn dev
   ```

## Usage

Once the server is running, you can interact with the API using tools like Postman or curl. For detailed API
documentation, you can access the Swagger UI by navigating
to [http://localhost:4000/api/swagger](http://localhost:4000/api/swagger) in your browser.

## Scripts

The Green Hive Backend API includes several npm scripts to help with development and testing:

- `yarn start`: Start the server.
- `yarn build`: Compile TypeScript files.
- `yarn test`: Run tests.
- `yarn dev`: Start the server in development mode with Nodemon.
- `yarn prisma:generate`: Generate Prisma client.
- `yarn prisma:migrate`: Run database migrations.
- `yarn prisma:studio`: Open Prisma Studio for database management.
- `yarn prisma:seed`: Seed the database with initial data.
- `yarn swagger`: Generate Swagger documentation.
- `yarn coverage`: Run tests with coverage.

You can execute these scripts using the Yarn command line interface (CLI) to perform various tasks such as starting the
server, running tests, generating documentation, and managing the database.

## Alerts API

### Weight Alerts

- **Condition**: `weight > 40000`
    - **Severity**: CRITICAL
    - **Message**: "Weight is greater than 40kg"

- **Condition**: `weight > 30000`
    - **Severity**: WARNING
    - **Message**: "Weight is greater than 30kg"

- **Condition**: `weight > 20000`
    - **Severity**: INFO
    - **Message**: "Weight is greater than 20kg"

### Tilt Alerts

- **Condition**: `|magnetic_x| > 1000` ou `|magnetic_y| > 1000` ou `|magnetic_z| > 1000`
    - **Severity**: WARNING
    - **Message**: "Hive is tilted"

### Temperature Alerts

- **Condition**: `tempBottomLeft < 33` ou `tempBottomLeft > 36` ou `tempTopRight < 33` ou `tempTopRight > 36`
    - **Severity**: WARNING
    - **Message**: "Couvain temperature is outside 33°C - 36°C range"

- **Condition**: `tempOutside > 30`
    - **Severity**: WARNING
    - **Message**: "Outside temperature is greater than 30°C, indicating queen laying extension"

- **Condition**: `tempOutside < 14`
    - **Severity**: CRITICAL
    - **Message**: "Outside temperature has dropped below 14°C"

- **Condition**: `tempBottomLeft < 18` ou `tempTopRight < 18`
    - **Severity**: CRITICAL
    - **Message**: "Internal temperature is below 18°C, indicating a serious issue"

### Sensor Alerts

- **Condition**: Capteur ne renvoie pas de données valides
    - **Severity**: INFO
    - **Message**: "Sensor '{key}' is not sending valid data"

## License

[MIT](https://choosealicense.com/licenses/mit/)