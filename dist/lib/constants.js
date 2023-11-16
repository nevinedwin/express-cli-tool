import chalk from "chalk";
export const _to_camelCase = (value) => {
    return value[0].toUpperCase() + value.slice(1, value.length).toLowerCase();
};
export const constants = {
    command: "express-bp",
    templateChoices: [
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
    controllerTemplate: (moduleName) => {
        const name = _to_camelCase(moduleName);
        return `"use strict";

    const { get${name}Helper, put${name}Helper, post${name}Helper, delete${name}Helper } = require("../helper/${name.toLowerCase()}.helper");
    const { failure, success } = require("../utils/common.utils");
    const { status_codes_msg } = require("../utils/constants.utils");
    
    exports.get${name}Controller = async (req, res) => {
      try {
        const data = get${name}Helper();
        success(res, status_codes_msg.SUCESS.message, data);
      } catch (error) {
        failure(res, error);
      };
    };
    
    exports.put${name}Controller = async (req, res) => {
      try {
        const data = put${name}Helper();
        success(res, status_codes_msg.SUCESS.message, data);
      } catch (error) {
        failure(res, error);
      };
    };
    
    exports.post${name}Controller = async (req, res) => {
      try {
        const data = post${name}Helper();
        success(res, status_codes_msg.SUCESS.message, data);
      } catch (error) {
        failure(res, error);
      };
    };
    
    exports.delete${name}Controller = async (req, res) => {
      try {
        const data = delete${name}Helper();
        success(res, status_codes_msg.SUCESS.message, data);
      } catch (error) {
        failure(res, error);
      };
    };`;
    },
    routerTemplate: (moduleName) => {
        const name = _to_camelCase(moduleName);
        return `const express = require('express');
    const { get${name}Controller, put${name}Controller, post${name}Controller, delete${name}Controller } = require('../controller/${name.toLowerCase()}.controller');
    const app = express();
    
    app.get('/', get${name}Controller)
    app.put('/', put${name}Controller)
    app.post('/', post${name}Controller)
    app.delete('/', delete${name}Controller)
    
    module.exports = app;`;
    },
    helperTemplate: (moduleName, db = '') => {
        const name = _to_camelCase(moduleName);
        const _l_name = name.toLowerCase();
        return `
    ${db === "mongo" ? `const ${_l_name}Model = require("../model/${_l_name}.model");` : ""}
    exports.get${name}Helper = () => {
      return "Test Data";
    };
    
    exports.put${name}Helper = () => {
      return "Test Data";
    };
    
    exports.post${name}Helper = () => {
      ${db === "mongo" ? `new ${_l_name}Model({data: "test"}).save();` : ""}
      return "Test Data";
    };
    
    exports.delete${name}Helper = () => {
      return "Test Data";
    };`;
    },
    modelTemplate: (value, type) => {
        const name = value.toLowerCase();
        let template = "";
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
    `;
                break;
            case 'dynamo':
                template = ``;
                break;
            case 'sql':
                template = ``;
            default:
                break;
        }
        ;
        return template;
    }
};
