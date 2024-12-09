# Express CLI Tool (express-cli-tool)

Kickstart your ExpressJS projects with ease using express-cli-tool, a powerful boilerplate generator designed to streamline the setup process and accelerate your development workflow. This npm package provides a robust foundation for Express applications, complete with pre-configured database settings and an automated component creation system.

Express CLI Tool supports on MacOS, windows and Linux.

- [Create an Express Application](#create-an-express-boiler-plate) - How to create new Express app.
- [Create Module](#create-module) - How to create Modules.
- [Change Port](#change-port) - How to change PORT.

## Installation

You should install it **globally**.


### With NPM

```sh
npm install -g express-cli-tool
```

### With Yarn

```sh
yarn global add express-cli-tool
```

## Create an Express Applciation

**Your system will need to have Node 16.16.0 or later version.**

To create an express app, you can choose one of the following method.

### Through Prompt

```sh
express create-app
```

This command will prompt to multiple options for configuring express app and database.


### Through Command
```sh
express create-app -t <templateName> -p <port> -d <database-type> -dn <database-name> <app name>
```

The command options are:

| Options              | Description                                |
|----------------------|--------------------------------------------|
| -t,  --template      | Specify the template [expressjs, expressts]|
| -p,  --port          | Specify the port, default 8081             |
| -d,  --database      | Specify the database [mongo, dynamo, none] |
| -dn, --databaseName  | Assign a name for database                 |


you can use --help command for knows this options and commands:

```sh
express --help
```

### Example
```sh
express create-app -t expressjs -p 3040 -d mongo -dn testdb app
```

After running the above commad it will create a project directory 'app' inside current folder.
Inside the directory You can see the Express Application.

```
app
├── node_modules
├── src
|    ├── config
|    ├── controller
|    ├── helper
|    ├── model
|    ├── router
|    ├── utils
|    └── app.js
├── .env
├── .gitignore
├── package-lock.json
└── package.json
```

Once the installation is done, open your project folder:

```sh
cd app
```

Applciation created.

## Run Application

For running application 

#### Using nodemon 

```sh
npm run dev
```
or
```sh
yarn run dev
```

#### Using node

```sh
npm start
```
or
```sh
yarn start
```


## Create Module

You can automatically create modules. Which means you can create Controller, router, model and helper templates using command.

command for creating module

```sh
express create-module <module-name>
```

For example;

```sh
express create-module user
```

It will create user.controller, user.router, user.model and user.helper files with basic crud api.

## Change Port

You can change the port of the application.

```sh
express change-port < port >
```
For Example
```sh
express change-port 3040
```

## About Express CLI Tool

| Features                | Description                     |
|-------------------------|---------------------------------|
| Boiler Plate Templates  | We supports Express-JS and Express-TS tempaltes       |
| Database                | MongoDB                         |
| Module Creation         | controller, router, model and helper|
| Change Port             | Can change the PORT of the application |

## DB Configuration

Express automaticaly configure db.

### MongoDB

For mongo as the database your system must contains mongod or If you want to run Mongodb Atlas just change the Uri in db.shared.js file as the mongodb atlas connection string

## License

Express CLI Tool (express-cli-tool) is open source software [licenced as MIT](https://github.com/nevinedwin/express-cli-tool/blob/main/LICENSE).