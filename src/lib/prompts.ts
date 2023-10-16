import inquirer from 'inquirer';
import { constants } from './constants.js';
import chalk from 'chalk';

type PromptType = {
  type: "input" | "number" | "confirm" | "list" | "rawlist" | "expand" | "checkbox" | "password" | "editor";
  name: string;
  message: string | Function;
  choices?: Array<string | number> | Function;
  defaultValue?: string | number | boolean | Array<any> | Function;
  validate?: Function;
  when?: boolean;
};

type DBType = "mongo" | "dynamo" | "none" | string;

type Class = new (...args: any[]) => any;

export function PromptClass<Base extends Class>(base: Base) {
  return class extends base {

    async promptCreateTemplate(newTemplate: string = ""): Promise<[any, string?]> {
      try {
        let template = newTemplate;
        if (!newTemplate) {
          let [e, temp]: [any, string?] = await prompt({
            name: "template",
            type: "list",
            message: `\nchoose template: ${chalk.grey('> use arrow keys to choose template and press enter')}\n`,
            choices: constants.templateChoices,
            when: constants.templateChoices.length > 0
          })
          if (e || !temp) throw e || "Template Selection Error";
          template = temp;
        }
        const templateName: string = constants.templates[__toPlainText(template)];
        return [null, templateName];
      } catch (e) {
        return [e]
      };
    };

    async PromptCreateFolder(): Promise<[any, string?]> {
      try {
        const [e, folderName]: [any, string?] = await prompt({
          name: "folder",
          type: "input",
          message: `Enter the project name: `,
          defaultValue: "first-app"
        })
        if (e || !folderName) throw e || "prompt Error";
        return [null, folderName];
      } catch (e) {
        return [e];
      };
    };

    async promptChoosePort(portParam: number = 0): Promise<[any, number?]> {
      try {
        let finalPort: number = portParam;
        if (portParam === 0) {
          const [e, port]: [any, string?] = await prompt({
            name: "port",
            type: "number",
            message: `Enter the PORT for your application: `,
            defaultValue: 8081
          });
          if (e || !port) throw e || "prompt Error";
          finalPort = parseInt(port, 10);
        }
        return [null, finalPort];
      } catch (error) {
        return [error]
      };
    };
    async promptChooseDB(db: DBType = ""): Promise<[any, DBType?]> {
      try {
        let dbConfig: DBType = db;
        if (!db ) {
          const [e, newDb]: [any, string?] = await prompt({
            name: "db",
            type: "list",
            message: `Select Database: `,
            choices: constants.db,
          });
          if (e || !newDb) throw e || "prompt Error"
          dbConfig = newDb;
        }
        return [null, dbConfig]
      } catch (error) {
        return [error]
      };
    };

    async promptDBName(dbName: string = "", projectName: string = ""): Promise<[any, string?]> {
      try {
        let name: string = dbName;
        if (typeof dbName !== "string" || !dbName) {
          const [e, nameDB]: [any, string?] = await prompt({
            name: "dbName",
            type: "input",
            message: `Enter name of the DB: `,
            defaultValue: projectName.toLowerCase()
          });
          if (e || !nameDB) throw e || "prompt Error"
          name = nameDB;
        }
        return [null, name];
      } catch (error) {
        return [error]
      }
    }
  };

};


export async function prompt({ type, name, message = "", choices = [], validate, defaultValue, when }: PromptType): Promise<[any, string?]> {
  try {
    const answer = await inquirer.prompt([
      {
        type,
        name,
        message,
        choices,
        validate,
        default: defaultValue
      }
    ]);
    return [null, answer[name]];
  } catch (error) {
    return [error]
  };
};


export function __toPlainText(txt: string): string {
  return txt.replace(/\u001b\[[0-9;]*m/g, '');
};
