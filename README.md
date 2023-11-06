# Express Boiler Plate CLI Tool (express-bp)

Express bp is a cli tool which can helps to create Express boiler plate easily. Along with that Database configuration and Automatic Module creation also available.

Express bp supports on MacOS, windows and Linux.

- [Create an Express boiler plate](#create-an-express-boiler-plate) - How to create new Express app.
- [Create Module](#create-module) - How to create Modules.

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

**Your system will need to have Node 14.0.0 or later version.**

To create an express app, you can choose one of the following method.

### Through Prompt

```sh
express-bp create-app
```

This command will prompt to multiple options for configuring express app and database.


### Through Command
```sh
express-bp create-app -t <templateName> -p <port> -d <database-type> -dn <database-name> app
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

After running the above commad it will create a project directory 'app' inside current folder.
Inside the directory You can see the Express Boiler Plate.

```
app
├── controller
├── helper
├── model
├── node_modules
├── router
├── shared
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

Once the installation is done, open your project folder:

```sh
cd app
```

Applciation created.

## Run Application

For running application 

#### env dev 

```sh
npm run dev
```

or

```sh
yarn run dev
```


#### env prod 
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

## About Express BP CLI Tool

| Features                | Description                     |
|-------------------------|---------------------------------|
| Boiler Plate Templates  | We supports Express-JS and Express-TS tempaltes       |
| Database                | MongoDB                         |
| Module Creation         | controller, router, model and helper|
| Versioning              | Initally Api version is v1, you can have the option to upgrade the version|

## License

Express boiler plate (express-bp) is open source software [licenced as MIT](https://github.com/nevinedwin/express-cli-tool/blob/main/LICENSE).