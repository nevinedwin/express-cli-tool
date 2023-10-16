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
import { ExecException, exec } from "child_process";
import ora from "ora";
import { Command } from "./lib/command.js";

type NpmInstallType = {
  status: boolean;
  error?: ExecException | null,
  stderr?: string,
  stdout?: string
};


type DBType = "mongo" | "dynamo" | "none" | string;

export class Main extends File(LoggerClass(PromptClass(class { }))) {

  args: Array<string>;
  private currentPath: string;
  private folderName: string;
  private template: string;
  private port: number;
  private dbName: string;
  private db: DBType;
  private destination: string;

  constructor(pss: Record<any, any>) {
    super();
    this.args = pss.argv;
    this.currentPath = pss.cwd();
    this.folderName = "";
    this.template = "";
    this.port = 0;
    this.dbName = "";
    this.db = "";
    this.destination = "";
  };

  async createBoilerPlate(targetDir: string = "", options: Record<any, any>): Promise<void> {
    try {
      if (options.template && !constants.plainTemplates.includes(options.template))
        throw super.logInvalidTemplate(options.template, "template");

      if (options.port && !/^[0-9]+$/.test(options.port))
        throw super.logInvalidTemplate(options.port, "port");

      if (options.database && !constants.db.includes(options.database))
        throw super.logInvalidTemplate(options.database, "database");

      if (!targetDir) {
        const [e, folderName]: [any, string?] = await super.PromptCreateFolder()
        if (e || !folderName) throw e;
        this.folderName = folderName;
      } else {
        this.folderName = targetDir;
      };

      const cwd: string = path.join(this.currentPath, this.folderName);
      this.destination = cwd;

      const [e, templateName] = await super.promptCreateTemplate(options?.template)
      if (e || !templateName) throw e || "Prompting Error";

      this.template = templateName;

      const [ef, folderExists] = super.checkFolderContains(this.template, this.destination);
      if (ef) throw ef;

      if (folderExists.length)
        throw super.logFolderConflicts(this.destination, folderExists);

      const [err, port] = await super.promptChoosePort(options.port);
      if (err || !port) throw err || "Prompting Error";
      this.port = port;

      const [er, db] = await super.promptChooseDB(options.database);
      if (er || !db) throw er || "PromptError";
      this.db = db;

      if (this.db && this.db !== "none") {
        const [e, dbName] = await super.promptDBName(options.databaseName, this.folderName);
        if (e || !dbName) throw e;
        this.dbName = dbName;
      };

      super.createTemplate(this.template, this.destination);
      const spinner = ora('Installing basic npm packages...').start();
      const isInstallSuccess: NpmInstallType = await this.#npmInstall();

      if (!isInstallSuccess.status) {
        spinner.fail("npm package installation failed..");
        throw isInstallSuccess.error;
      };

      spinner.succeed("Succesfully installed basic npm packages");

      if (constants.db.includes(this.db) && this.db !== 'none') {
        super.createDBFile(this.destination, this.db);
        const packageName = constants.dbPackages[this.db];
        const spinner = ora(`Installing packages for db`).start();
        const dbPackage = await this.#npmInstall(packageName);

        if (!dbPackage.status) {
          spinner.fail('Intallation failed');
          throw dbPackage.error;
        };

        spinner.succeed()

        const modelCreation = await super.createModel('test', this.destination, this.db);
        if (modelCreation.error) throw modelCreation.error;
      };

      process.exit(0);
    } catch (er) {
      console.log(er);
      process.exit(1);
    };
  };

  async createModule(action: string) {
    try {
      if (!action) throw super.logModuleNameNotProvided();
      super.checkModuleExists(this.destination, true);
    } catch (error) {
      console.log(error);
      process.exit(1);
    };
  };

  async showVerison(): Promise<void> {
    try {
      const fileContent = await super.readPackageJSON()
      if (!fileContent.status) throw fileContent.error;
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    };
  };

  async #npmInstall(packageName: string = ""): Promise<NpmInstallType> {
    const command = packageName ? `npm i ${packageName}` : `npm i`;
    const installNpm: { error?: ExecException | null, stderr: string, stdout: string } = await new Promise((resolve, reject) => {
      exec(`cd ${this.destination} && ${command}`, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          reject({ error });
        }
        resolve({ stderr, stdout })
      })
    })

    if (installNpm.error) {
      return { status: false, error: installNpm.error };
    } else {
      return { status: true, stdout: installNpm.stdout, stderr: installNpm.stderr };
    };
  };

};


// ------------starting point------------ //
const cli = new Command();
cli.prs();

