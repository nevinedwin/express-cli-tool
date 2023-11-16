import chalk from "chalk";
import { constants } from "./constants.js";
export function LoggerClass(base) {
    return class extends base {
        logFolderAlreadyExists(folderName) {
            return `\nThe folder ${chalk.blue(folderName)} already exists.\n`;
        }
        ;
        logFolderConflicts(path, folderList) {
            return `\nThe directory ${chalk.green(path)}
      contains files that could conflict:
      neither try using a new directory name,
      or remove the files/folder listed below.
      \n\n${chalk.blue(folderList)}\n`;
        }
        ;
        logInvalidTemplate(value, type = "template") {
            return `\nInvalid ${type} option ${chalk.blue(value)}\n`;
        }
        ;
        logModuleNameNotProvided() {
            return `\nPlease specify the module name
      ${constants.command} ${chalk.yellow('create-module')} ${chalk.blue('< module name >')}\nFor example:
      ${constants.command} ${chalk.yellow('create-module')} ${chalk.blue('user')}\n`;
        }
        ;
        logPortNotProvided() {
            return `\nPlease specify the Port
      ${constants.command} ${chalk.yellow('change-port')} ${chalk.blue('< port >')}\nFor example:
      ${constants.command} ${chalk.yellow('change-port')} ${chalk.blue(3040)}\n`;
        }
        ;
        logDbInfo() {
            return `\n
      Currently, we support only ${chalk.green('MongoDB')} as the database system.
      We are actively working on introducing support for ${chalk.red('DynamoDB')}, 
      it will be available in upcoming versions of the Express Boiler Plate (express-bp) CLI Tool.
      `;
        }
        ;
        logTemplateInfo() {
            return `\n
      Currently, we support only ${chalk.yellow('Express-JS')} template.
      We are actively working on introducing ${chalk.blue('Express-TS')} template, 
      it will be available in upcoming versions of the Express Boiler Plate (express-bp) CLI Tool.
      `;
        }
        ;
        logModuleResponse(error) {
            let moduleType = "";
            let isError = false;
            error.forEach(each => {
                if (!each.status) {
                    moduleType += `${each.moduleType} `;
                    isError = true;
                }
            });
            if (isError) {
                return {
                    status: false, data: `\nModule ${chalk.red(error[0].moduleName)} is already exists in ${chalk.red(moduleType)}.
        `
                };
            }
            ;
            return {
                status: true, data: `\nModule ${chalk.green(error[0].moduleName)} created successfully.
      `
            };
        }
        ;
        createValidation(options) {
            if (options.template && !constants.plainTemplates.includes(options.template))
                return this.logInvalidTemplate(options.template, "template");
            this.portValidation(options.port);
            if (options.database && !constants.db.includes(options.database))
                return this.logInvalidTemplate(options.database, "database");
            return null;
        }
        ;
        portValidation(port) {
            if (port && !/^[0-9]+$/.test(port))
                return this.logInvalidTemplate(port, "port");
        }
        ;
        logSuccessInstallation(appName) {
            return `\nTemplate created successfully.
      cd ${appName}
      npm run dev
      `;
        }
        ;
        logEnvCreationMessage() {
            return `\nPlease create ${chalk.blue('.env')} or copy your ${chalk.blue('.env')} for changing port.\n`;
        }
        ;
        logPortChangeSuccess(port) {
            return `\n${chalk.green('Successfully')} changed the PORT\n`;
        }
        ;
    };
}
;
