# Express Boiler Plate CLI Tool (express-bp)

Express bp is a cli tool which can helps to create Express boiler plate easily. Along with that Database configuration and Automatic Module creation also available.

Express bp supports on MacOS, windows and Linux.

- [Create an Express boiler plate](#create-an-express-boiler-plate) - How to create new Express app.
- [Create Module](#create-module) - How to create Modules.
- [Change Port](#change-port) - How to change PORT.

## Installation

You should install it **globally**.

### With NPM

```sh
npm install -g express-bp
```

### With Yarn

```sh
yarn global add express-bp
```

## Create an Express boiler plate

**Your system will need to have Node 16.16.0 or later version.**

To create an express app, you can choose one of the following method.

### Through Prompt

```sh
express-bp create-app
```

This command will prompt to multiple options for configuring express app and database.


### Through Command
```sh
express-bp create-app -t <templateName> -p <port> -d <database-type> -dn <database-name> <app name>
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
express-bp --help
```

### Example
```sh
express-bp create-app -t expressjs -p 3040 -d mongo -dn testdb app
```

After running the above commad it will create a project directory 'app' inside current folder.
Inside the directory You can see the Express Boiler Plate.

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
express-bp create-module <module-name>
```

For example;

```
express-bp create-module user
```

It will create user.controller, user.router, user.model and user.helper files with basic crud api.

## Change Port

You can change the port of the application.

```sh
express-bp change-port < port >
```
For Example
```sh
express-bp change-port 3040
```

## About Express BP CLI Tool

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

Express boiler plate (express-bp) is open source software [licenced as MIT](https://github.com/nevinedwin/express-cli-tool/blob/main/LICENSE).