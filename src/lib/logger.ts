import chalk from "chalk";

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

  };
};