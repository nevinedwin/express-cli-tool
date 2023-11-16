import { program } from "commander";
import { Main } from "../index.js";

export class Command {

  private main: Main;

  constructor() {
    const main = new Main(process);
    this.main = main;
  };

  async init() {
    await this.getVerison();
    this.setUpCommands()
  };

  private setUpCommands() {
    this.initCommand();
    this.createComponentCommand();
    this.helpCustom();
    this.changeVersion();
    this.changePort();
  };

  private initCommand() {
    program
      .command('create-app [targetDir]')
      .description('For creating templated')
      .option('-t, --template [value]', "Initialize with a template [expressjs, expressts]")
      .option('-p, --port [value]', 'Initialize with port')
      .option('-d, --database [value]', 'Initalize with a database. It accepts ("monogo", "dynamo", "none")')
      .option('-dn, --databaseName [value]', 'Assign name to Database')
      .action(async (action: string = "", cmd: Record<any, any>) => {
        await this.main.createBoilerPlate(action, cmd);
      });
  };

  private createComponentCommand() {
    program
      .command('create-module [moduleName]')
      .description('For creating components')
      .action(async (action: string) => {
        await this.main.createModule(action);
      });
  };

  private changePort() {
    program
      .command('change-port [port]')
      .description('For changing port')
      .action(async (action: string) => {
        await this.main.changePort(action);
      });
  };

  private async getVerison() {
    const version: string = await this.main.showVerison();
    program.version(version);
  };

  private changeVersion() {
    program
      .command('change-version')
      .description('Change the version of your Application')
      .action(async () => {
        await this.main.changeUserAppVersion();
      });
  };

  private helpCustom() {
    program.on('--help', () => {
      console.log(`\nCommands [options]:\n  create:
        -t,  --template <template Name>      Specify the template [expressjs, expressts]
        -p,  --port <port>                   Specify the port, default 8081
        -d,  --database <databaseValue>      Specify the database [mongo, dynamo, none]
        -dn, --databaseName <databaseName>   Assign a name for database
        `);
    });
  };

  prs(): void {
    program.parse(this.main.args);
  };
};