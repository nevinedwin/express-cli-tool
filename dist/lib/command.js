import { program } from "commander";
import { PromptClass } from "./prompts.js";
import path from "path";
import { File } from "./files.js";
import { LoggerClass } from "./logger.js";
import { constants } from "./constants.js";
import { exec } from "child_process";
import ora from "ora";
export class CommandClass extends File(LoggerClass(PromptClass(class {
}))) {
    args;
    currentPath;
    folderName;
    template;
    port;
    dbName;
    db;
    destination;
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
        this.initCommand();
    }
    ;
    initCommand() {
        program
            .command('create [targetDir]')
            .description('For creating templated')
            .option('--template [value]', "Initialize with a template")
            .option('--port [value]', 'Initialize with port')
            .option('--d [value]', 'Initalize with a db. Accepts ("monogo", "dynamo", "none")')
            .option('--dbname [value]', 'Initizalize with a db name')
            .action(async (action = "", cmd) => {
            await this.createBoilerPlate(action, cmd);
        });
    }
    ;
    async createBoilerPlate(targetDir = "", options) {
        try {
            if (options.template && !constants.plainTemplates.includes(options.template)) {
                throw super.logInvalidTemplate(options.template, "template");
            }
            ;
            if (options.port && !/^[0-9]+$/.test(options.port)) {
                throw super.logInvalidTemplate(options.port, "port");
            }
            ;
            if (options.d && !constants.db.includes(options.d)) {
                throw super.logInvalidTemplate(options.d, "database");
            }
            ;
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
            const [ef, folderExists] = super.checkFolderContains(this.template, this.destination);
            if (ef)
                throw ef;
            if (folderExists.length)
                throw super.logFolderConflicts(this.destination, folderExists);
            const [err, port] = await super.promptChoosePort(options.port);
            if (err || !port)
                throw err || "Prompting Error";
            this.port = port;
            const [er, db] = await super.promptChooseDB(options.d);
            if (er || !db)
                throw er || "PromptError";
            this.db = db;
            if (this.db && this.db !== "none") {
                const [e, dbName] = await super.promptDBName(options.dbname, this.folderName);
                if (e || !dbName)
                    throw e;
                this.dbName = dbName;
            }
            ;
            super.createTemplate(this.template, this.destination);
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
                const spinner = ora(`Installing packages for db`).start();
                const dbPackage = await this.#npmInstall(packageName);
                if (!dbPackage.status) {
                    spinner.fail('Intallation failed');
                    throw dbPackage.error;
                }
                ;
                spinner.succeed();
            }
            ;
        }
        catch (er) {
            console.log(er);
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
    prs() {
        program.parse(this.args);
    }
    ;
}
;
