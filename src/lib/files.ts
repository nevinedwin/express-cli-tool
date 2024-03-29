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
  ignoreExistance?: boolean,
  isTs: boolean
};

export type createRouterInVersionFolderType = {
  source: string;
  isVersioning: boolean;
  moduleName: string,
  isTs: boolean
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

    #userPath(source: string, isTs: boolean = false) {
      return {
        '_package.json': `${source}/package.json`,
        _main: `${source}/src/app.${isTs ? 'ts' : 'js'}`,
        _db_shared: `${source}/src/config/db.config.${isTs ? 'ts' : 'js'}`,
        _env: `${source}/.env`
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

    checkFolderContains(templateName: string, destination: string): CommonReturnType {
      try {
        if (!fs.existsSync(destination)) {
          return { status: true, data: [] }
        };

        const templatePath: string = `${this.__dirname.slice(0, this.__dirname.lastIndexOf("\lib"))}/templates/${templateName}`;
        const templateFiles: Array<string> = fs.readdirSync(templatePath);
        const destinationArray: Array<string> = fs.readdirSync(destination);

        let duplicateFileArray: Array<string | null> = [];

        const setA = new Set(destinationArray);

        for (let _i = 0; _i < templateFiles.length; _i++) {
          if (setA.has(templateFiles[_i])) {
            duplicateFileArray.push(templateFiles[_i]);
          };
        };

        return { status: true, data: duplicateFileArray };
      } catch (e) {
        console.log(e);
        return { status: false, error: e };
      };
    };

    getTemplatePath(libPath: string, templateName: string): string {
      return `${libPath.slice(0, libPath.lastIndexOf("\lib"))}/templates/${templateName}`
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

    // Function for creating db.shared.js
    async createDBFile(destination: string, dbType: DBType, isTS: boolean = false): Promise<CommonReturnType> {
      try {
        // getting the db config template path
        const source = this.getTemplatePath(this.__dirname, `dbTemplates/${dbType}.${isTS ? 'config.ts' : 'config.js'}`);
        // geting the project path
        const newDestination = this.#userPath(destination, isTS)._db_shared;

        // reading db template
        const readResult = await this.#readFile(source)
        if (readResult.err || !readResult.data) throw readResult.err;

        // creating config folder
        if (!fs.existsSync(`${destination}/src/config`)) {
          fs.mkdirSync(`${destination}/src/config`);
        };

        // writing db template
        readResult.data && await this.#writeFile(newDestination, readResult.data);
        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };

    // getting version from package.json
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
    async createModuleFiles(createModuleFilesParams: CreateModuleFilesType):
      Promise<{ error?: any, status: boolean, moduleType: string, moduleName?: string }> {
      try {
        const { moduleType,
          moduleName,
          destination,
          modelType = "",
          isVersioning = false,
          ignoreExistance = false,
          isTs = false
        } = createModuleFilesParams;

        if (!ignoreExistance &&
          fs.existsSync(`${destination}/src/${moduleType}/${moduleName.toLowerCase()}.${moduleType}.${isTs ? 'ts' : 'js'}`)) {
          throw `${moduleName} module is already exists.`
        };

        const chooseTemplete = {
          controller: constants.controllerTemplate(moduleName, isTs),
          model: constants.modelTemplate(moduleName, modelType, isTs),
          router: constants.routerTemplate(moduleName, isTs),
          helper: constants.helperTemplate(moduleName, modelType, isTs)
        };

        const template: string = chooseTemplete[moduleType];


        if (!fs.existsSync(`${destination}/src/${moduleType}`)) {
          fs.mkdirSync(`${destination}/src/${moduleType}`);
        };

        await this.#writeFile(`${destination}/src/${moduleType}/${moduleName.toLowerCase()}.${moduleType}.${isTs ? 'ts' : 'js'}`, template);

        if (moduleType === 'router') {
          await this.#createRouterInVersionFolder({
            source: destination,
            isVersioning: false,
            moduleName,
            isTs
          })
        }

        return { status: true, moduleType, moduleName };
      } catch (error) {
        const { moduleName, moduleType } = createModuleFilesParams;
        return { status: false, error, moduleType, moduleName };
      };
    };

    // Function for importing router in V1/ version folder
    async #createRouterInVersionFolder({
      source = "",
      moduleName = "",
      isVersioning = false,
      isTs = false
    }: createRouterInVersionFolderType): Promise<CommonReturnType> {
      try {

        const _guav = await this.getUserAppVersion(source);
        if (!_guav.status) throw _guav.error;

        const version = _guav.data;

        let path;
        if (isVersioning) {
          path = `${source}/src/router/v${version}.router.${isTs ? 'ts' : 'js'}`;
        } else {
          path = `${source}/src/router/v1.router.${isTs ? 'ts' : 'js'}`;
        }
        const regEx = isTs ? /export\s*default\s*app/ : /module\.exports\s*=\s*app;?/;
        const newStr = isTs ? `import ${moduleName.toLowerCase()}Router from './${moduleName.toLowerCase()}.router.js';\napp.use('/${moduleName.toLowerCase()}', ${moduleName.toLowerCase()}Router);` : `app.use('/${moduleName.toLowerCase()}', require('./${moduleName.toLowerCase()}.router'));`;
        const oldStr = isTs ? `\n\nexport default app;` : '\n\nmodule.exports = app;'
        const updatedString = newStr + oldStr;

        const assignRouter = await this.customiseValue(path, updatedString, regEx);
        if (!assignRouter.status) throw assignRouter.error;

        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };


    async customiseValue(source: string, updatedString: string = "", regex: RegExp): Promise<CommonReturnType> {
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

    async assignPort(port: number, source: string, createFile: boolean = false): Promise<CommonReturnType> {
      try {

        const path = this.#userPath(source)._env;
        const newData = `PORT=${port}`;

        if (!fs.existsSync(path) && !createFile) {
          return { status: true, data: false };
        };

        let envNewData = "";

        if (fs.existsSync(path)) {
          const envData = await this.#readFile(path);
          if (envData.err) throw envData?.err || "Error in reading .env file";
          envNewData = envData.data || "";
        }


        if (envNewData.includes("PORT")) {
          const updatedData = envNewData.replace(/PORT=.+/, newData);
          await this.#writeFile(path, updatedData);
        } else {
          await new Promise((resolve, reject) => {
            fs.appendFile(path, '\n' + newData, (err) => {
              if (err) {
                reject(err);
              };
              resolve('Port added successfully');
            });
          });
        };
        return { status: true, data: true };
      } catch (error) {
        return { status: false, error };
      };
    };

    async assignDBName(dbName: string, source: string, createFile: boolean = false, isTs: boolean = false): Promise<CommonReturnType> {

      try {
        const path = this.#userPath(source)._env;
        const newData = `URI=${`mongodb://127.0.0.1:27017/${dbName}`}`;

        if (!fs.existsSync(path) && !createFile) {
          return { status: true, data: false };
        };

        let envNewData = "";

        if (fs.existsSync(path)) {
          const envData = await this.#readFile(path);
          if (envData.err) throw envData?.err || "Error in reading .env file";
          envNewData = envData.data || "";
        }


        if (envNewData.includes("DB_NAME")) {
          const updatedData = envNewData.replace(/URI=.+/, newData);
          await this.#writeFile(path, updatedData);
        } else {
          await new Promise((resolve, reject) => {
            fs.appendFile(path, '\n' + newData, (err) => {
              if (err) {
                reject(err);
              };
              resolve('DB_NAME added successfully');
            });
          });
        };

        const serverPath = this.#userPath(source, isTs)._main;
        const regexServer = /const\s+app\s*=\s*express\(\);?/;
        const prevLine = isTs ? "import connectDatabase from './config/db.config.js';" : "const { connectDatabase } = require('./config/db.config');";
        const refLine = '\n\nconst app = express();';
        const newLine = '\n\nconnectDatabase()';
        const newUpdateString = prevLine + refLine + newLine;

        const assignServer = await this.customiseValue(serverPath, newUpdateString, regexServer);
        if (!assignServer.status) throw assignServer.error;

        return { status: true, data: true };
      }
      catch (error) {
        return { status: false, error };
      };
    };

    async changePackageJSON(changeItem: 'name' | 'version' = 'name', destination: string = "", appName: string = ""): Promise<CommonReturnType> {
      try {
        const source = this.#userPath(destination)['_package.json'];
        const readPackage = await this.#readFile(source);
        if (readPackage.err || !readPackage.data) throw readPackage?.err || "Error in reading package.json";
        const packageJsonData = JSON.parse(readPackage.data);
        let version: string | number = parseInt(packageJsonData.version);
        if (changeItem === "version") {
          packageJsonData.version = `${version + 1}.0.0`;
        } else {
          packageJsonData.name = appName.toLowerCase();
        };

        await this.#writeFile(source, JSON.stringify(packageJsonData, null, 2));
        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };

    async getUserAppVersion(source: string = ""): Promise<CommonReturnType> {
      try {
        const path = this.#userPath(source)['_package.json'];
        const readPackage = await this.#readFile(path);
        if (readPackage.err || !readPackage.data) throw readPackage?.err || "Error in reading package.json";
        const parsedReadPackage = JSON.parse(readPackage.data);
        const version = parseInt(parsedReadPackage.version);
        return { status: true, data: version };
      } catch (error) {
        return { status: false, error };
      };
    };

    async updateRouterVersion(source: string = ""): Promise<CommonReturnType> {
      try {
        return { status: true };
      } catch (error) {
        return { status: false, error };
      };
    };

    // Function for finding database in the project
    async findDatabase(source: string = "", isTs: boolean = false): Promise<CommonReturnType> {
      try {
        const path = this.#userPath(source, isTs)._db_shared;
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
