import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { error } from 'console';

type Class = new (...args: any[]) => any;
type DBType = "mongo" | "dynamo" | "none" | string;

export function File<Base extends Class>(base: Base) {
  return class extends base {

    __filename: any;
    __dirname: any;

    constructor(...args: any[]) {
      super(...args)
      this.__filename = fileURLToPath(import.meta.url);
      this.__dirname = dirname(this.__filename);
    };

    async #readFile(source: string): Promise<{ err?: NodeJS.ErrnoException | null, data?: string }> {
      return new Promise((resolve, reject) => {
        fs.readFile(source, 'utf-8', (err: NodeJS.ErrnoException | null, data: string) => {
          if (err) {
            reject({ err });
          };
          resolve({ data });
        });
      });
    };

    async #writeFile(destination: string, content: string): Promise<{ err?: NodeJS.ErrnoException | null, data?: boolean }> {
      return new Promise((resolve, reject) => {
        fs.writeFile(destination, content, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            reject({ err });
          };
          resolve({ data: true })
        });
      });
    };

    checkFileExists(source: string, destination: string): Array<any> {
      try {
        const newDestination = destination.slice(0, destination.lastIndexOf("/"));
        if (newDestination !== source && fs.existsSync(destination)) {
          return [null, true];
        };
        return [null, false];
      } catch (er) {
        return [er];
      };
    };


    checkFolderContains(templateName: string, destination: string): Array<any> {

      try {

        if (!fs.existsSync(destination)) {
          return [null, []]
        };

        const templatePath: string = `${this.__dirname.slice(0, this.__dirname.lastIndexOf("\lib"))}/templates/${templateName}`;
        const templateFiles: Array<string> = fs.readdirSync(templatePath);
        const destinationArray: Array<string> = fs.readdirSync(destination);

        let duplicateFileArray: Array<string | null> = [];

        const setA = new Set(destinationArray);

        for (let _i = 0; _i < templateFiles.length; _i++) {
          if (setA.has(templateFiles[_i])) {
            duplicateFileArray.push(templateFiles[_i])
          };
        };

        return [null, duplicateFileArray]
      } catch (e) {
        console.log(e);
        return [e]
      }
    };

    copyTheDBFile(templateName: string = "", dbname: string = "") {
      try {
        const templatePath: string = this.__dirname.replace(/\/lib$/, `/templates/${templateName}`);
        const databasePath: string = this.__dirname.replace(/\/lib$/, `/templates/dbtemplates/${dbname}.js`);
        const destinationPath: string = path.join(templatePath, 'shared', 'db.shared.js');

        if (!fs.existsSync(destinationPath)) {
          new Promise((resolve, reject) => {
            fs.copyFileSync(databasePath, destinationPath);
          })
        }
        return [null, true];
      } catch (error) {
        return [error];
      };
    };


    getTemplatePath(libPath: string, templateName: string): string {
      return `${libPath.slice(0, libPath.lastIndexOf("/lib"))}/templates/${templateName}`
    };

    createTemplate(templateName: string = "", destination: string = "", flag: boolean = false) {

      let source: string = "";
      if (!flag) {
        // source = `${this.__dirname.slice(0, this.__dirname.lastIndexOf("\lib"))}/templates/${templateName}`;
        source = this.getTemplatePath(this.__dirname, templateName);
      } else {
        source = templateName;
      };

      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
      };

      const files = fs.readdirSync(source);
      for (let i = 0; i < files.length; i++) {
        const sourcePath = path.join(source, files[i]);
        const destinationPath = path.join(destination, files[i]);

        if (fs.statSync(sourcePath).isDirectory()) {
          this.createTemplate(sourcePath, destinationPath, true);
        } else {
          fs.copyFileSync(sourcePath, destinationPath);
        }
      };
    };

    async createDBFile(destination: string, dbType: DBType) {
      const source = this.getTemplatePath(this.__dirname, `dbTemplates/${dbType}.config.js`);
      const newDestination = `${destination}/shared/db.shared.js`;

      const readResult = await this.#readFile(source)
      if (readResult.err) {
        return { status: false, error }
      };

      readResult.data && await this.#writeFile(newDestination, readResult.data);
    };
  };
};