import chalk from "chalk";
import { constants } from "./constants.js";
import { CommonReturnType } from "./files.js";

type Class = new (...args: any[]) => any;

export function LoggerClass<Base extends Class>(base: Base) {
  return class extends base {

    logFolderAlreadyExists(folderName: string): string {
      return `\nThe folder ${chalk.blue(folderName)} already exists.\n`
    };

    logFolderConflicts(path: string, folderList: [string]): string {
      return `\nThe directory ${chalk.green(path)}
      contains files that could conflict:
      neither try using a new directory name,
      or remove the files/folder listed below.
      \n\n${chalk.blue(folderList)}\n`
    };

    logInvalidTemplate(value: string | number, type: string = "template"): string {
      return `\nInvalid ${type} option ${chalk.blue(value)}\n`
    };

    logModuleNameNotProvided() {
      return `\nPlease specify the module name
      ${constants.command} ${chalk.yellow('create-module')} ${chalk.blue('< module name >')}\nFor example:
      ${constants.command} ${chalk.yellow('create-module')} ${chalk.blue('user')}\n`
    };

    logDbInfo() {
      return `\n
      Currently, we support only ${chalk.green('MongoDB')} as the database system.
      We are actively working on introducing support for ${chalk.red('DynamoDB')}, 
      it will be available in upcoming versions of the Express Boiler Plate (express-bp) CLI Tool.
      `
    };

    logTemplateInfo() {
      return `\n
      Currently, we support only ${chalk.yellow('Express-JS')} template.
      We are actively working on introducing ${chalk.blue('Express-TS')} template, 
      it will be available in upcoming versions of the Express Boiler Plate (express-bp) CLI Tool.
      `
    };

    logModuleResponse(error: Array<Record<any, any>>): CommonReturnType {
      let moduleType: string = "";
      let isError: boolean = false;
      error.forEach(each => {
        if (!each.status) {
          moduleType += `${each.moduleType} `;
          isError = true;
        }
      });
      if (isError) {
        return {
          status: false, data: `\nModule ${chalk.red(error[0].moduleName)} is already exists in ${chalk.red(moduleType)}.
        `};
      };

      return {
        status: true, data: `\nModule ${chalk.green(error[0].moduleName)} created successfully.
      ` };
    };

    createValidation(options: Record<any, any>) {
      if (options.template && !constants.plainTemplates.includes(options.template))
        return this.logInvalidTemplate(options.template, "template");

      if (options.port && !/^[0-9]+$/.test(options.port))
        return this.logInvalidTemplate(options.port, "port");

      if (options.database && !constants.db.includes(options.database))
        return this.logInvalidTemplate(options.database, "database");

      return null;
    };

    logSuccessInstallation() {
      return `\nTemplate created successfully.
      npm run dev
      `
    }
  };
};