# NodeJS Setup with PostgreSQL

Welcome to the NodeJS setup with PostgreSQL project! This repository provides a boilerplate for a Node.js application with PostgreSQL as the database.

## Setup Steps

Follow these steps to set up the project:

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone git@github.com:harishsharma29/nodejs-postgres-setup.git
```

### 2. Install Dependencies

Install the required dependencies in your local machine:

```bash
npm install
```

### 3. Create evn file

Create enviournment variable file for your local machine using .env.sample file, you can copy .env.sample and update its values

```bash
cp .env.sample .env
```

### 4. Start the server

To run the development server with hot module reload:

```bash
npm run start:dev
```

To deploy the production server:

```bash
npm run start
```

## Project Structure

The project structure is organized as follows:

* `README.md` : Project Description.
* `apidoc.json` : JSON object to create API doc.
* `package.json` : Project dependencies.
* `package-lock.json` : Version for all the dependecies.
* `pm2-processes.json` : JSON object to run backend server via PM2 process manager.
* `src`
    * `config` : All configrations files i.e. constant, database schema or status messages.
    * `controllers` : Module wise all controller like for users user.js, for posts post.js
    * `database` : Database related files i.e. model, migrations, seeders and database connections.
    * `index.js` : Entrypoint of backend server.
    * `middleware` : Middleware (Application-level, Router-level Middleware, Third party, Error Handling Middleware etc...).
    * `routes` : Version wise all modules routes.
    * `services` : All service file which can't be placed inside controller file will get placed here.
    * `utils` : Service or helper files to run the backend server.
    * `validations` : Consists module wise requests validations logic.