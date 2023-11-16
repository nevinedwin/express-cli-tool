/**
* Copyright (c) 2023 Nevin Edwin.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
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
    // Function for creating boiler plate
    async createBoilerPlate(targetDir = "", options) {
        try {
            // validating template, port and database is given correctly 
            const validation = super.createValidation(options);
            if (validation)
                throw validation;
            // validation for folder name and prompt for it 
            if (!targetDir) {
                const _pcf = await super.PromptCreateFolder();
                if (!_pcf.status)
                    throw _pcf.error || "Prompting Error";
                this.folderName = _pcf.data;
            }
            else {
                this.folderName = targetDir;
            }
            ;
            // setting the user project path
            const cwd = path.join(this.currentPath, this.folderName);
            this.destination = cwd;
            // prompt for choosing template
            const promptCreateTemplateResp = await super.promptCreateTemplate(options?.template);
            if (!promptCreateTemplateResp.status)
                throw promptCreateTemplateResp.error || "Prompting Error";
            this.template = promptCreateTemplateResp.data;
            // ----------Remove the below line of code when Express-ts is introduced
            while (this.template === 'express-ts-template') {
                console.log(super.logTemplateInfo());
                options.template = "";
                const _pctResp = await super.promptCreateTemplate(options?.template);
                if (!_pctResp.status)
                    throw _pctResp.error || "Prompting Error";
                this.template = _pctResp.data;
            }
            ;
            // --------------
            // Checking the project folder already contains any similar folder or file in our boiler plate
            const _cfc = super.checkFolderContains(this.template, this.destination);
            if (!_cfc.status)
                throw _cfc.error;
            if (_cfc.data.length)
                throw super.logFolderConflicts(this.destination, _cfc.data);
            // prompt for choosing port
            const _pcp = await super.promptChoosePort(options.port);
            if (!_pcp.status)
                throw _pcp.error || "Prompting Error";
            this.port = _pcp.data;
            // prompt for choosing database
            const _pcdb = await super.promptChooseDB(options.database);
            if (!_pcdb.status)
                throw _pcdb.error || "PromptError";
            this.db = _pcdb.data;
            // ----------Remove this line of code when introduce dynamodb
            while (this.db === 'dynamo') {
                console.log(super.logDbInfo());
                options.database = "";
                const _pcdbnew = await super.promptChooseDB(options.database);
                if (!_pcdbnew.status)
                    throw _pcdbnew.error || "PromptError";
                this.db = _pcdbnew.data;
            }
            ;
            // -----------
            // prompt for writing db name
            if (this.db && this.db !== "none") {
                const _pcdbname = await super.promptDBName(options.databaseName, this.folderName);
                if (!_pcdbname.status)
                    throw _pcdbname.error;
                this.dbName = _pcdbname.data;
            }
            ;
            // copying template to project folder
            super.createTemplate(this.template, this.destination);
            // assigning user given port value to project
            if (this.port) {
                const _isapSuccess = await super.assignPort(this.port, this.destination, true);
                if (!_isapSuccess.status)
                    throw _isapSuccess.error;
            }
            ;
            // changing the name of the package.json as the project name
            const _cpj = await super.changePackageJSON('name', this.destination, this.folderName);
            if (!_cpj.status)
                throw _cpj.error;
            // installing all dependencies for intializing project
            const spinner = ora('Installing basic npm packages...').start();
            const isInstallSuccess = await this.#npmInstall();
            if (!isInstallSuccess.status) {
                spinner.fail("npm package installation failed..");
                throw isInstallSuccess.error;
            }
            ;
            spinner.succeed("Succesfully installed basic npm packages");
            // adding db configurations
            if (this.db !== 'none') {
                //  creating db.shared.js
                const _cdb = await super.createDBFile(this.destination, this.db);
                if (!_cdb.status)
                    throw _cdb.error;
                // getting the db package name
                const packageName = constants.dbPackages[this.db];
                const spinner = ora(`Configuring database`).start();
                // installing db dependencies
                const dbPackage = await this.#npmInstall(packageName);
                if (!dbPackage.status) {
                    spinner.fail('Configuration failed');
                    throw dbPackage.error;
                }
                ;
                spinner.succeed("DB Configured success.");
                // assigning given name to the database 
                const _adbn = await super.assignDBName(this.dbName, this.destination);
                if (!_adbn.status)
                    throw _adbn.error;
                // creating model folder and test model
                const modelCreation = await super.createModuleFiles({
                    moduleName: 'test',
                    destination: this.destination,
                    modelType: this.db,
                    moduleType: 'model',
                    isVersioning: this.isVersioningEnable
                });
                if (!modelCreation.status)
                    throw modelCreation.error;
                // updating helper folder as it can perform db operations
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
            console.log(super.logSuccessInstallation(this.folderName));
            process.exit(0);
        }
        catch (er) {
            console.log(er);
            process.exit(1);
        }
        ;
    }
    ;
    //  Function for creating modules
    async createModule(action) {
        try {
            // validating module name is given or not
            if (!action)
                throw super.logModuleNameNotProvided();
            const modules = ["router", "controller", "helper"];
            // getting the database
            const findDatabaseResp = await super.findDatabase(this.currentPath);
            if (findDatabaseResp.status) {
                modules.push('model');
            }
            ;
            // creating modules
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
            // creating modules
            const data = await Promise.all(promises);
            const logResult = super.logModuleResponse(data);
            if (!logResult.status)
                throw logResult.data;
            console.log(logResult.data);
            process.exit(0);
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
        ;
    }
    ;
    // Function for showing application verison
    async showVerison() {
        try {
            const fileContent = await super.readPackageJSON();
            if (!fileContent.status)
                throw fileContent.error;
            const version = fileContent?.data || "1.0.0";
            return version;
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
        ;
    }
    ;
    // Function for installing npm packages
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
    async changePort(action) {
        try {
            // if port not given logging a error message
            if (!action)
                throw super.logPortNotProvided();
            // if port is invalid like string showing error message
            if (super.portValidation(action))
                throw super.portValidation(action);
            // Assigning port
            const result = await super.assignPort(parseInt(action), this.currentPath);
            if (!result.status)
                throw result.error || "Error in assigning port";
            if (result.status && !result.data) {
                const resp = await super.promptEnv();
                if (resp.status && !resp.data) {
                    console.log(super.logEnvCreationMessage());
                    process.exit(0);
                }
                ;
            }
            ;
            const portCreation = await super.assignPort(parseInt(action), this.currentPath, true);
            if (!portCreation.status)
                throw portCreation.error;
            console.log(super.logPortChangeSuccess(parseInt(action)));
            process.exit(0);
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
        ;
    }
    ;
}
;
// ------------starting point------------ //
const cli = new Command();
cli.init().then(() => {
    cli.prs();
});
