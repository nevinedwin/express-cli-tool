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
    };
}
;
