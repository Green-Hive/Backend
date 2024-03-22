# Green Hive Backend API

This repository contains the backend API for managing bee hive data for the Green Hive project.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)s
- [License](#license)

## Introduction

The Green Hive Backend API is built to provide functionality for managing bee hive data. It allows users to perform various operations such as creating, updating, deleting, and retrieving hive data through a RESTful API.

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

Once the server is running, you can interact with the API using tools like Postman or curl. For detailed API documentation, you can access the Swagger UI by navigating to [http://localhost:4000/api/swagger](http://localhost:4000/api/swagger) in your browser.

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

You can execute these scripts using the Yarn command line interface (CLI) to perform various tasks such as starting the server, running tests, generating documentation, and managing the database.


## License

[MIT](https://choosealicense.com/licenses/mit/)