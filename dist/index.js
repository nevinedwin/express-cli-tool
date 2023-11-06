/**
 * Copyright (c) 2023-present, Nevin Edwin.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
'use strict';
import { PromptClass } from "./lib/prompts.js";
import path from "path";
import { File } from "./lib/files.js";
import { LoggerClass } from "./lib/logger.js";
import { constants } from "./lib/constants.js";
import { exec } from "child_process";
import ora from "ora";
import { Command } from "./lib/command.js";
export class Main extends File(LoggerClass(PromptClass(class {
}))) {
    args;
    currentPath;
    folderName;
    template;
    port;
    dbName;
    db;
    destination;
    isVersioningEnable;
    constructor(pss) {
        super();
        this.args = pss.argv;
        this.currentPath = pss.cwd();
        this.folderName = "";
        this.template = "";
        this.port = 0;
        this.dbName = "";
        this.db = "";
        this.destination = "";
        this.isVersioningEnable = true;
    }
    ;
    async createBoilerPlate(targetDir = "", options) {
        try {
            if (options.template && !constants.plainTemplates.includes(options.template))
                throw super.logInvalidTemplate(options.template, "template");
            if (options.port && !/^[0-9]+$/.test(options.port))
                throw super.logInvalidTemplate(options.port, "port");
            if (options.database && !constants.db.includes(options.database))
                throw super.logInvalidTemplate(options.database, "database");
            if (!targetDir) {
                const [e, folderName] = await super.PromptCreateFolder();
                if (e || !folderName)
                    throw e;
                this.folderName = folderName;
            }
            else {
                this.folderName = targetDir;
            }
            ;
            const cwd = path.join(this.currentPath, this.folderName);
            this.destination = cwd;
            const [e, templateName] = await super.promptCreateTemplate(options?.template);
            if (e || !templateName)
                throw e || "Prompting Error";
            this.template = templateName;
            // ----------Remove the below line of code when Express-ts is introduced
            while (this.template === 'express-ts-template') {
                console.log(super.logTemplateInfo());
                options.template = "";
                const [e, templateName] = await super.promptCreateTemplate(options?.template);
                if (e || !templateName)
                    throw e || "Prompting Error";
                this.template = templateName;
            }
            ;
            // --------------
            const [ef, folderExists] = super.checkFolderContains(this.template, this.destination);
            if (ef)
                throw ef;
            if (folderExists.length)
                throw super.logFolderConflicts(this.destination, folderExists);
            const [err, port] = await super.promptChoosePort(options.port);
            if (err || !port)
                throw err || "Prompting Error";
            this.port = port;
            const [er, db] = await super.promptChooseDB(options.database);
            if (er || !db)
                throw er || "PromptError";
            this.db = db;
            // ----------Remove this line of code when introduce dynamodb
            while (this.db === 'dynamo') {
                console.log(super.logDbInfo());
                options.database = "";
                const [er, db] = await super.promptChooseDB(options.database);
                if (er || !db)
                    throw er || "PromptError";
                this.db = db;
            }
            ;
            // -----------
            if (this.db && this.db !== "none") {
                const [e, dbName] = await super.promptDBName(options.databaseName, this.folderName);
                if (e || !dbName)
                    throw e;
                this.dbName = dbName;
            }
            ;
            super.createTemplate(this.template, this.destination);
            if (this.port)
                await super.assignPort(this.port, this.destination);
            await super.changePackageJSON('name', this.destination, this.folderName);
            const spinner = ora('Installing basic npm packages...').start();
            const isInstallSuccess = await this.#npmInstall();
            if (!isInstallSuccess.status) {
                spinner.fail("npm package installation failed..");
                throw isInstallSuccess.error;
            }
            ;
            spinner.succeed("Succesfully installed basic npm packages");
            if (constants.db.includes(this.db) && this.db !== 'none') {
                super.createDBFile(this.destination, this.db);
                const packageName = constants.dbPackages[this.db];
                const spinner = ora(`Configuring database`).start();
                const dbPackage = await this.#npmInstall(packageName);
                if (!dbPackage.status) {
                    spinner.fail('Configuration failed');
                    throw dbPackage.error;
                }
                ;
                spinner.succeed("DB Configured success.");
                const modelCreation = await super.createModuleFiles({
                    moduleName: 'test',
                    destination: this.destination,
                    modelType: this.db,
                    moduleType: 'model',
                    isVersioning: this.isVersioningEnable
                });
                if (!modelCreation.status)
                    throw modelCreation.error;
                await super.assignDBName(this.dbName, this.destination);
                const helperCreation = await super.createModuleFiles({
                    moduleName: 'test',
                    destination: this.destination,
                    modelType: this.db,
                    moduleType: 'helper',
                    isVersioning: this.isVersioningEnable,
                    ignoreExistance: true
                });
                if (!helperCreation.status)
                    throw helperCreation.error;
            }
            ;
            process.exit(0);
        }
        catch (er) {
            console.log(er);
            process.exit(1);
        }
        ;
    }
    ;
    async createModule(action) {
        try {
            if (!action)
                throw super.logModuleNameNotProvided();
            const modules = ["router", "controller", "helper"];
            const findDatabaseResp = await super.findDatabase(this.currentPath);
            console.log(findDatabaseResp);
            if (findDatabaseResp.status) {
                modules.push('model');
            }
            ;
            console.log(modules);
            const promises = modules.map(async (eachItem) => {
                const params = {
                    moduleType: eachItem,
                    moduleName: action,
                    destination: this.currentPath,
                    isVersioning: this.isVersioningEnable,
                    modelType: findDatabaseResp.data
                };
                return super.createModuleFiles(params);
            });
            const data = await Promise.all(promises);
            const logResult = super.logModuleResponse(data);
            if (!logResult.status)
                throw logResult.message;
            console.log(logResult.message);
            process.exit(0);
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
        ;
    }
    ;
    async showVerison() {
        try {
            const fileContent = await super.readPackageJSON();
            if (!fileContent.status)
                throw fileContent.error;
            console.log(fileContent.data);
            process.exit(0);
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
        ;
    }
    ;
    async #npmInstall(packageName = "") {
        const command = packageName ? `npm i ${packageName}` : `npm i`;
        const installNpm = await new Promise((resolve, reject) => {
            exec(`cd ${this.destination} && ${command}`, (error, stdout, stderr) => {
                if (error) {
                    reject({ error });
                }
                resolve({ stderr, stdout });
            });
        });
        if (installNpm.error) {
            return { status: false, error: installNpm.error };
        }
        else {
            return { status: true, stdout: installNpm.stdout, stderr: installNpm.stderr };
        }
        ;
    }
    ;
    async changeUserAppVersion() {
        try {
            // change the version in package.json; update major version if 1=>2;
            const changeVersion = await super.changePackageJSON('version', this.currentPath);
            if (!changeVersion.status)
                throw changeVersion?.error;
            // change the router version;
            if (this.isVersioningEnable) {
                const changeRounterVersion = await super.updateRouterVersion(this.currentPath);
            }
            ;
            process.exit(0);
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
    ;
}
;
// ------------starting point------------ //
const cli = new Command();
cli.prs();
