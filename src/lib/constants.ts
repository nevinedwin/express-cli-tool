import chalk from "chalk";

export const _to_camelCase = (value: string) => {
  return value[0].toUpperCase() + value.slice(1, value.length).toLowerCase()
};

export const constants: Record<string, any> = {
  command: "express",
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
  controllerTemplate: (moduleName: string, isTS: boolean = false): string => {
    const name = _to_camelCase(moduleName);

    if(isTS){
      return `
"use strict";

import { get${name}Helper, put${name}Helper, post${name}Helper, delete${name}Helper } from '../helper/${name.toLowerCase()}.helper.js';
import { failure, success } from '../utils/common.utils.js';
import constant from "../utils/constants.utils.js";

import { Request, Response } from 'express';

const { status_codes_msg } = constant;


export const get${name}Controller = async (req: Request, res: Response) => {
  try {
    const data = get${name}Helper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};

export const put${name}Controller = async (req: Request, res: Response) => {
  try {
    const data = put${name}Helper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};

export const post${name}Controller = async (req: Request, res: Response) => {
  try {
    const data = post${name}Helper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};

export const delete${name}Controller = async (req: Request, res: Response) => {
  try {
    const data = delete${name}Helper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};
      `
    }


    return `
"use strict";

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
  routerTemplate: (moduleName: string, isTS: boolean = false): string => {

    const name = _to_camelCase(moduleName);
    
    if(isTS){
      return `
import express from 'express';

import { delete${name}Controller, get${name}Controller, post${name}Controller, put${name}Controller, } from '../controller/${name.toLowerCase()}.controller.js';

const app = express();


app.get('/', get${name}Controller)
app.put('/', put${name}Controller)
app.post('/', post${name}Controller)
app.delete('/', delete${name}Controller)


export default app;`
    };

    return `
const express = require('express');
const { get${name}Controller, put${name}Controller, post${name}Controller, delete${name}Controller } = require('../controller/${name.toLowerCase()}.controller');
const app = express();

app.get('/', get${name}Controller)
app.put('/', put${name}Controller)
app.post('/', post${name}Controller)
app.delete('/', delete${name}Controller)

module.exports = app;`;
  },
  helperTemplate: (moduleName: string, db: string = '', isTS: boolean = false): string => {
    const name = _to_camelCase(moduleName);
    const _l_name = name.toLowerCase();
    if (isTS) {
      return `
${db === "mongo" ? ` import ${_l_name}Model from "../model/${_l_name}.model.js"; ` : ""}

export const get${name}Helper = () => {
  return "${name} Data";
};

export const put${name}Helper = () => {
  return "${name} Data";
};

export const post${name}Helper = () => {
  ${db === "mongo" ? `new ${_l_name}Model({data: "test"}).save();` : ""}
  return "${name} Data";
};

export const delete${name}Helper = () => {
  return "${name} Data";
};
      `
    };
    return `
${db === "mongo" ? `const ${_l_name}Model = require("../model/${_l_name}.model");` : ""}
exports.get${name}Helper = () => {
  return "${name} Data";
};

exports.put${name}Helper = () => {
  return "${name} Data";
};

exports.post${name}Helper = () => {
  ${db === "mongo" ? `new ${_l_name}Model({data: "test"}).save();` : ""}
  return "${name} Data";
};

exports.delete${name}Helper = () => {
  return "${name} Data";
};`;
  },
  modelTemplate: (value: string, type: string, isTs: boolean = false): string => {
    const name = value.toLowerCase();
    let template = ""
    switch (type) {
      case 'mongo':
        template = `"use strict";

${isTs ? `import mongoose  from "mongoose";` : `const { default: mongoose } = require("mongoose");`}

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

${isTs ? `export default mongoose.model("${name}", ${name}Schema);` : `module.exports = mongoose.model("${name}", ${name}Schema);`}
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