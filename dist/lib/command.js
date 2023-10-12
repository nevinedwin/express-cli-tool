import { program } from "commander";
import { PromptClass } from "./prompts.js";
import path from "path";
import { File } from "./files.js";
import { LoggerClass } from "./logger.js";
import { constants } from "./constants.js";
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
            .option('--db [value]', 'Initalize with a db')
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
            if (options.db && !constants.db.includes(options.db)) {
                throw super.logInvalidTemplate(options.db, "database");
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
            const [ef, folderExists] = super.checkFolderContains(this.template, cwd);
            if (ef)
                throw ef;
            if (folderExists.length)
                throw super.logFolderConflicts(cwd, folderExists);
            const [err, port] = await super.promptChoosePort(options.port);
            if (err || !port)
                throw err || "Prompting Error";
            this.port = port;
            const [er, db] = await super.promptChooseDB(options.db);
            if (er || !db)
                throw er;
            this.db = db;
            if (db && db !== "no-db") {
                const [e, dbName] = await super.promptDBName(options.dbname, this.folderName);
                if (e || !dbName)
                    throw e;
                this.dbName = dbName;
            }
            ;
            super.createTemplate(this.template, this.destination);
        }
        catch (er) {
            console.log(er);
            process.exit(1);
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
