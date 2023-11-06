import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { constants } from './constants.js';
import { DBType } from '../index.js';

type Class = new (...args: any[]) => any;
export type CreateModuleFilesType = {
  moduleType: "controller" | "model" | "router" | "helper",
  moduleName: string,
  destination: string,
  modelType?: DBType,
  isVersioning?: boolean,
  ignoreExistance?: boolean
};

export type createRouterInVersionFolderType = {
  source: string;
  isVersioning: boolean;
  moduleName: string
};

export type CommonReturnType = {
  status: boolean,
  error?: any,
  data?: any,
  message?: any
};


export function File<Base extends Class>(base: Base) {
  return class extends base {

    __filename: any;
    __dirname: any;

    constructor(...args: any[]) {
      super(...args)
      this.__filename = fileURLToPath(import.meta.url);
      this.__dirname = dirname(this.__filename);
    };

    #userPath(source: string) {
      return {
        '_package.json': `${source}/package.json`,
        _server: `${source}/server.js`,
        _db_shared: `${source}/shared/db.shared.js`
      };
    };

    #modelRegex(str: string = "") {
      const modelRegex = [
        {
          reg: /require\(\s*["']mongoose["']\)/,
          model: 'mongo'
        }
      ];

      let model = "";

      modelRegex.forEach((each) => {
        if (str.match(each.reg)) {
          model = each.model;
        }
      })
      return model;
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

    createTemplate(templateName: string = "", destination: string = "", isExactTemplatePath: boolean = false) {
      try {
        let source: string = "";
        if (!isExactTemplatePath) {
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
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
    };

    async createDBFile(destination: string, dbType: DBType) {
      const source = this.getTemplatePath(this.__dirname, `dbTemplates/${dbType}.config.js`);
      const newDestination = this.#userPath(destination)._db_shared;

      const readResult = await this.#readFile(source)
      if (readResult.err || !readResult.data) {
        return { status: false, error: readResult.err }
      };

      readResult.data && await this.#writeFile(newDestination, readResult.data);
    };

    async readPackageJSON(): Promise<{ status: boolean, error?: any, data?: string }> {
      try {
        const source = `${this.__dirname.slice(0, this.__dirname.lastIndexOf('dist'))}package.json`;
        const fileContent = await this.#readFile(source);
        if (fileContent.err || !fileContent.data)
          throw fileContent.err;
        const version = JSON.parse(fileContent.data).version;
        return { status: true, data: version };
      } catch (error) {
        return { status: false, error };
      };
    };

    // Function for creating all modules
    async createModuleFiles(createModuleFilesParams: CreateModuleFilesType): Promise<{ error?: any, status: boolean, moduleType: string, moduleName?: string }> {
      try {
        const { moduleType, moduleName, destination, modelType = "", isVersioning = false, ignoreExistance = false } = createModuleFilesParams;

        if (!ignoreExistance && fs.existsSync(`${destination}/${moduleType}/${moduleName.toLowerCase()}.${moduleType}.js`)) {
          throw `${moduleName} module is already exists.`
        };

        const chooseTemplete = {
          controller: constants.controllerTemplate(moduleName),
          model: constants.modelTemplate(moduleName, modelType),
          router: constants.routerTemplate(moduleName),
          helper: constants.helperTemplate(moduleName, modelType)
        };

        const template: string = chooseTemplete[moduleType];


        if (!fs.existsSync(`${destination}/${moduleType}`)) {
          fs.mkdirSync(`${destination}/${moduleType}`);
        };

        await this.#writeFile(`${destination}/${moduleType}/${moduleName.toLowerCase()}.${moduleType}.js`, template);

        if (moduleType === 'router') {
          await this.#createRouterInVersionFolder({
            source: destination,
            isVersioning: false,
            moduleName
          })
        }

        return { status: true, moduleType, moduleName };
      } catch (error) {
        const { moduleName, moduleType } = createModuleFilesParams;
        return { status: false, error, moduleType, moduleName };
      };
    };

    async #createRouterInVersionFolder({ source = "", moduleName = "", isVersioning = false }: createRouterInVersionFolderType): Promise<{ status: boolean, error?: any }> {
      try {

        const { version } = await this.getUserAppVersion(source);
        let path;
        if (isVersioning) {
          path = `${source}/router/v${version}.router.js`;
        } else {
          path = `${source}/router/v1.router.js`;
        }
        const regEx = /module\.exports\s*=\s*app;?/;
        const newStr = `app.use('/${moduleName.toLowerCase()}', require('./${moduleName.toLowerCase()}.router'));`;
        const oldStr = '\n\nmodule.exports = app;'
        const updatedString = newStr + oldStr;

        const assignRouter = await this.customiseValue(path, updatedString, regEx);
        if (!assignRouter.status) throw assignRouter.error;

        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };


    async customiseValue(source: string, updatedString: string = "", regex: RegExp): Promise<{ status: boolean, error?: any }> {
      try {
        const readSource = await this.#readFile(source);
        if (readSource.err || !readSource.data) throw readSource?.err || "Error in reading file";
        const replaceData = readSource.data.replace(regex, updatedString);
        if (replaceData) {
          const writeResp = await this.#writeFile(source, replaceData);
          if (writeResp.err) throw writeResp.err;
        };
        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };

    async assignPort(port: number, source: string): Promise<{ status: boolean, error?: any }> {
      try {
        const path = this.#userPath(source)._server;
        const regex = /const\s+port\s*=\s*\d+\s*?;?/;
        const assignPort = await this.customiseValue(path, `const port = ${port};`, regex);
        if (!assignPort.status) throw assignPort.error;

        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };

    async assignDBName(dbName: string, source: string): Promise<{ status: boolean, error?: any }> {
      try {
        const path = this.#userPath(source)._db_shared;
        const regex = /const\s+dbName\s*=\s*[^;]+\s*?;?/;
        const updateString = `const dbName = "${dbName}";`;

        const assignDBName = await this.customiseValue(path, updateString, regex);
        if (!assignDBName.status) throw assignDBName.error;

        const serverPath = this.#userPath(source)._server;
        const regexServer = /const\s+app\s*=\s*express\(\);?/;
        const prevLine = "const { connectDatabase } = require('./shared/db.shared');";
        const refLine = '\n\nconst app = express();';
        const newLine = '\n\nconnectDatabase()';
        const newUpdateString = prevLine + refLine + newLine;

        const assignServer = await this.customiseValue(serverPath, newUpdateString, regexServer);
        if (!assignServer.status) throw assignServer.error;

        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };

    async changePackageJSON(changeItem: 'name' | 'version' = 'name', destination: string = "", appName: string = ""): Promise<{ status: boolean, error?: any }> {
      try {
        const source = this.#userPath(destination)['_package.json'];
        const readPackage = await this.#readFile(source);
        if (readPackage.err || !readPackage.data) throw readPackage?.err || "Error in reading package.json";
        const packageJsonData = JSON.parse(readPackage.data);
        let version: string | number = parseInt(packageJsonData.version);
        if (changeItem === "version") {
          packageJsonData.version = `${version + 1}.0.0`;
        } else {
          packageJsonData.name = appName;
        };

        await this.#writeFile(source, JSON.stringify(packageJsonData, null, 2));
        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };

    async getUserAppVersion(source: string = ""): Promise<{ status: boolean, error?: any, version?: number }> {
      try {
        const path = this.#userPath(source)['_package.json'];
        const readPackage = await this.#readFile(path);
        if (readPackage.err || !readPackage.data) throw readPackage?.err || "Error in reading package.json";
        const parsedReadPackage = JSON.parse(readPackage.data);
        const version = parseInt(parsedReadPackage.version);
        return { status: true, version };
      } catch (error) {
        return { status: false, error };
      };
    };

    async updateRouterVersion(source: string = ""): Promise<{ status: boolean, error?: any }> {
      try {
        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };

    async findDatabase(source: string = ""): Promise<CommonReturnType> {
      try {
        const path = this.#userPath(source)._db_shared;
        const readData = await this.#readFile(path);
        if (readData.err || !readData.data) throw readData.err;
        const model = this.#modelRegex(readData.data);
        if (!model) throw "The Application is not configured with any database";
        return { status: true, data: model };
      } catch (error) {
        return { status: false, error };
      };
    };

  };

};
