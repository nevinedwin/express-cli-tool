import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

type Class = new (...args: any[]) => any;

export function File<Base extends Class>(base: Base) {
  return class extends base {

    __filename: any;
    __dirname: any;

    constructor(...args: any[]) {
      super(...args)
      this.__filename = fileURLToPath(import.meta.url);
      this.__dirname = dirname(this.__filename);
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

    createTemplate(templateName: string = "", destination: string = "", flag: boolean = false) {

      let source: string = "";
      if (!flag) {
        source = `${this.__dirname.slice(0, this.__dirname.lastIndexOf("\lib"))}/templates/${templateName}`;
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
    }

  };
};