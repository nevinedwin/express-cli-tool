import inquirer from 'inquirer';
import { constants } from './constants.js';
import chalk from 'chalk';
export function PromptClass(base) {
    return class extends base {
        async promptCreateTemplate(newTemplate = "") {
            try {
                let template = newTemplate;
                if (!newTemplate) {
                    let [e, temp] = await prompt({
                        name: "template",
                        type: "list",
                        message: `\nchoose template: ${chalk.grey('> use arrow keys to choose template and press enter')}\n`,
                        choices: constants.templateChoices,
                        when: constants.templateChoices.length > 0
                    });
                    if (e || !temp)
                        throw e || "Template Selection Error";
                    template = temp;
                }
                const templateName = constants.templates[__toPlainText(template)];
                return { status: true, data: templateName };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async PromptCreateFolder() {
            try {
                const [e, folderName] = await prompt({
                    name: "folder",
                    type: "input",
                    message: `Enter the project name: `,
                    defaultValue: "first-app"
                });
                if (e || !folderName)
                    throw e || "prompt Error";
                return { status: true, data: folderName };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async promptChoosePort(portParam = 0) {
            try {
                let finalPort = portParam;
                if (portParam === 0) {
                    const [e, port] = await prompt({
                        name: "port",
                        type: "number",
                        message: `Enter the PORT for your application: `,
                        defaultValue: 8081
                    });
                    if (e || !port)
                        throw e || "prompt Error";
                    finalPort = parseInt(port, 10);
                }
                return { status: true, data: finalPort };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async promptChooseDB(db = "") {
            try {
                let dbConfig = db;
                if (!db) {
                    const [e, newDb] = await prompt({
                        name: "db",
                        type: "list",
                        message: `Select Database: `,
                        choices: constants.db,
                    });
                    if (e || !newDb)
                        throw e || "prompt Error";
                    dbConfig = newDb;
                }
                return { status: true, data: dbConfig };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async promptDBName(dbName = "", projectName = "") {
            try {
                let name = dbName;
                if (typeof dbName !== "string" || !dbName) {
                    const [e, nameDB] = await prompt({
                        name: "dbName",
                        type: "input",
                        message: `Enter name of the DB: `,
                        defaultValue: projectName.toLowerCase()
                    });
                    if (e || !nameDB)
                        throw e || "prompt Error";
                    name = nameDB;
                }
                return { status: true, data: name };
            }
            catch (error) {
                return { status: false, error };
            }
        }
        ;
        async promptEnv() {
            try {
                const [e, confirmation] = await prompt({
                    name: "confirmation",
                    type: "confirm",
                    message: "Missing .env file. Continue with creating new .env file",
                    defaultValue: false
                });
                if (e)
                    throw e || "Prompt Error";
                return { status: true, data: confirmation };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
    };
}
;
export async function prompt({ type, name, message = "", choices = [], validate, defaultValue, when }) {
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
    }
    catch (error) {
        return [error];
    }
    ;
}
;
export function __toPlainText(txt) {
    return txt.replace(/\u001b\[[0-9;]*m/g, '');
}
;
