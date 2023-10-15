import chalk from "chalk";


export const constants: Record<string, any> = {
  command: "express-bp",
  templateChoices:
    [
      `${chalk.yellow("Express-JS")}`,
      `${chalk.blue("Express-TS")}`,
      // `${chalk.blue("React-JS")}`,
      // `${chalk.yellow("React-TS")}`
    ],
  plainTemplates: [
    "expressjs",
    "expressts"
  ],
  db: [
    "mongo",
    "dynamo",
    "none"
  ],
  templates: {
    "Express-JS": 'express-template',
    "Express-TS": 'express-ts-template',
    "expressjs": 'express-template',
    "expressts": 'express-ts-template'
  },
  dbPackages: {
    "mongo": "mongoose",
    "dynamo": "aws-sdk"
  },
  controllerTemplate: (name: string): string => {
    return `"use strict";

    const { get${name}Helper, put${name}Helper, post${name}Helper, delete${name}Helper } = require("../helper/${name.toLowerCase()}.helper");
    const { failure, success } = require("../shared/common.shared");
    const { status_codes_msg } = require("../shared/static.shared");
    
    exports.get${name}Controller = async (req, res) => {
      try {
        const data = get${name}Helper();
        success(res, status_codes_msg.SUCESS, data);
      } catch (error) {
        failure(res, error);
      };
    };
    
    exports.put${name}Controller = async (req, res) => {
      try {
        const data = put${name}Helper();
        success(res, status_codes_msg.SUCESS, data);
      } catch (error) {
        failure(res, error);
      };
    };
    
    exports.post${name}Controller = async (req, res) => {
      try {
        const data = post${name}Helper();
        success(res, status_codes_msg.SUCESS, data);
      } catch (error) {
        failure(res, error);
      };
    };
    
    exports.delete${name}Controller = async (req, res) => {
      try {
        const data = delete${name}Helper();
        success(res, status_codes_msg.SUCESS, data);
      } catch (error) {
        failure(res, error);
      };
    };`;
  },
  routerTemplate: (name: string): string => {
    return `const express = require('express');
    const { get${name}Controller, put${name}Controller, post${name}Controller, delete${name}Controller } = require('../controller/${name.toLowerCase()}.controller');
    const app = express();
    
    app.get('/', get${name}Controller)
    app.put('/', put${name}Controller)
    app.post('/', post${name}Controller)
    app.delete('/', delete${name}Controller)
    
    module.exports = app;`;
  },
  helperTemplate: (name: string): string => {
    return `exports.get${name}Helper = () => {
      return "Test Data";
    };
    
    exports.put${name}Helper = () => {
      return "Test Data";
    };
    
    exports.post${name}Helper = () => {
      return "Test Data";
    };
    
    exports.delete${name}Helper = () => {
      return "Test Data";
    };`;
  },
  modelTemplate: (value: string, type: string): string => {
    const name = value.toLowerCase();
    let template = ""
    switch (type) {
      case 'mongo':
        template = `"use strict";

const { default: mongoose } = require("mongoose");

const ${name}Schema = new mongoose.Schema(
  {
    data: {
      type: String,
      default: ""
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("${name}", ${name}Schema);
    `
        break;
      case 'dynamo':
        template = ``;
        break;
      case 'sql':
        template = ``;
      default:
        break;
    };
    return template;
  }
};