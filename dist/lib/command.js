import { program } from "commander";
import { Main } from "../index.js";
export class Command {
    main;
    constructor() {
        const main = new Main(process);
        this.main = main;
        this.initCommand();
        this.showVersionCommand();
        this.createComponentCommand();
        this.helpCustom();
    }
    ;
    initCommand() {
        program
            .command('create [targetDir]')
            .description('For creating templated')
            .option('-t, --template [value]', "Initialize with a template")
            .option('-p, --port [value]', 'Initialize with port')
            .option('-d, --database [value]', 'Initalize with a database. It accepts ("monogo", "dynamo", "none")')
            .option('-dn, --databaseName [value]', 'Assign name to Database')
            .action(async (action = "", cmd) => {
            await this.main.createBoilerPlate(action, cmd);
        });
    }
    ;
    createComponentCommand() {
        program
            .command('create-module [moduleName]')
            .description('For creating components')
            .action(async (action) => {
            await this.main.createModule(action);
        });
    }
    ;
    showVersionCommand() {
        program
            .option('-v, --version', 'Shows version')
            .action(async () => {
            await this.main.showVerison();
        });
    }
    ;
    helpCustom() {
        program.on('--help', () => {
            console.log(`\nCommands [options]:\n  create:
        -t,  --template <template Name>      Specify the template [expressjs, expressts]
        -p,  --port <port>                   Specify the port, default 8081
        -d,  --database <databaseValue>      Specify the database [mongo, dynamo, none]
        -dn, --databaseName <databaseName>   Assign a name for database
        `);
        });
    }
    ;
    prs() {
        program.parse(this.main.args);
    }
    ;
}
;
