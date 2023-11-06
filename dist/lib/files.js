import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { constants } from './constants.js';
export function File(base) {
    return class extends base {
        __filename;
        __dirname;
        constructor(...args) {
            super(...args);
            this.__filename = fileURLToPath(import.meta.url);
            this.__dirname = dirname(this.__filename);
        }
        ;
        #userPath(source) {
            return {
                '_package.json': `${source}/package.json`,
                _server: `${source}/server.js`,
                _db_shared: `${source}/shared/db.shared.js`
            };
        }
        ;
        #modelRegex(str = "") {
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
            });
            return model;
        }
        ;
        async #readFile(source) {
            return new Promise((resolve, reject) => {
                fs.readFile(source, 'utf-8', (err, data) => {
                    if (err) {
                        reject({ err });
                    }
                    ;
                    resolve({ data });
                });
            });
        }
        ;
        async #writeFile(destination, content) {
            return new Promise((resolve, reject) => {
                fs.writeFile(destination, content, (err) => {
                    if (err) {
                        reject({ err });
                    }
                    ;
                    resolve({ data: true });
                });
            });
        }
        ;
        checkFolderContains(templateName, destination) {
            try {
                if (!fs.existsSync(destination)) {
                    return { status: true, data: [] };
                }
                ;
                const templatePath = `${this.__dirname.slice(0, this.__dirname.lastIndexOf("\lib"))}/templates/${templateName}`;
                const templateFiles = fs.readdirSync(templatePath);
                const destinationArray = fs.readdirSync(destination);
                let duplicateFileArray = [];
                const setA = new Set(destinationArray);
                for (let _i = 0; _i < templateFiles.length; _i++) {
                    if (setA.has(templateFiles[_i])) {
                        duplicateFileArray.push(templateFiles[_i]);
                    }
                    ;
                }
                ;
                return { status: true, data: duplicateFileArray };
            }
            catch (e) {
                console.log(e);
                return { status: false, error: e };
            }
            ;
        }
        ;
        getTemplatePath(libPath, templateName) {
            return `${libPath.slice(0, libPath.lastIndexOf("/lib"))}/templates/${templateName}`;
        }
        ;
        createTemplate(templateName = "", destination = "", isExactTemplatePath = false) {
            try {
                let source = "";
                if (!isExactTemplatePath) {
                    source = this.getTemplatePath(this.__dirname, templateName);
                }
                else {
                    source = templateName;
                }
                ;
                if (!fs.existsSync(destination)) {
                    fs.mkdirSync(destination);
                }
                ;
                const files = fs.readdirSync(source);
                for (let i = 0; i < files.length; i++) {
                    const sourcePath = path.join(source, files[i]);
                    const destinationPath = path.join(destination, files[i]);
                    if (fs.statSync(sourcePath).isDirectory()) {
                        this.createTemplate(sourcePath, destinationPath, true);
                    }
                    else {
                        fs.copyFileSync(sourcePath, destinationPath);
                    }
                }
                ;
            }
            catch (error) {
                console.log(error);
                process.exit(1);
            }
        }
        ;
        // Function for creating db.shared.js
        async createDBFile(destination, dbType) {
            try {
                // getting the db config template path
                const source = this.getTemplatePath(this.__dirname, `dbTemplates/${dbType}.config.js`);
                // geting the project path
                const newDestination = this.#userPath(destination)._db_shared;
                // reading db template
                const readResult = await this.#readFile(source);
                if (readResult.err || !readResult.data)
                    throw readResult.err;
                // writing db template
                readResult.data && await this.#writeFile(newDestination, readResult.data);
                return { status: true };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        // getting version from package.json
        async readPackageJSON() {
            try {
                const source = `${this.__dirname.slice(0, this.__dirname.lastIndexOf('dist'))}package.json`;
                const fileContent = await this.#readFile(source);
                if (fileContent.err || !fileContent.data)
                    throw fileContent.err;
                const version = JSON.parse(fileContent.data).version;
                return { status: true, data: version };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        // Function for creating all modules
        async createModuleFiles(createModuleFilesParams) {
            try {
                const { moduleType, moduleName, destination, modelType = "", isVersioning = false, ignoreExistance = false } = createModuleFilesParams;
                if (!ignoreExistance &&
                    fs.existsSync(`${destination}/${moduleType}/${moduleName.toLowerCase()}.${moduleType}.js`)) {
                    throw `${moduleName} module is already exists.`;
                }
                ;
                const chooseTemplete = {
                    controller: constants.controllerTemplate(moduleName),
                    model: constants.modelTemplate(moduleName, modelType),
                    router: constants.routerTemplate(moduleName),
                    helper: constants.helperTemplate(moduleName, modelType)
                };
                const template = chooseTemplete[moduleType];
                if (!fs.existsSync(`${destination}/${moduleType}`)) {
                    fs.mkdirSync(`${destination}/${moduleType}`);
                }
                ;
                await this.#writeFile(`${destination}/${moduleType}/${moduleName.toLowerCase()}.${moduleType}.js`, template);
                if (moduleType === 'router') {
                    await this.#createRouterInVersionFolder({
                        source: destination,
                        isVersioning: false,
                        moduleName
                    });
                }
                return { status: true, moduleType, moduleName };
            }
            catch (error) {
                const { moduleName, moduleType } = createModuleFilesParams;
                return { status: false, error, moduleType, moduleName };
            }
            ;
        }
        ;
        // Function for importing router in V1/ version folder
        async #createRouterInVersionFolder({ source = "", moduleName = "", isVersioning = false }) {
            try {
                const _guav = await this.getUserAppVersion(source);
                if (!_guav.status)
                    throw _guav.error;
                const version = _guav.data;
                let path;
                if (isVersioning) {
                    path = `${source}/router/v${version}.router.js`;
                }
                else {
                    path = `${source}/router/v1.router.js`;
                }
                const regEx = /module\.exports\s*=\s*app;?/;
                const newStr = `app.use('/${moduleName.toLowerCase()}', require('./${moduleName.toLowerCase()}.router'));`;
                const oldStr = '\n\nmodule.exports = app;';
                const updatedString = newStr + oldStr;
                const assignRouter = await this.customiseValue(path, updatedString, regEx);
                if (!assignRouter.status)
                    throw assignRouter.error;
                return { status: true };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async customiseValue(source, updatedString = "", regex) {
            try {
                const readSource = await this.#readFile(source);
                if (readSource.err || !readSource.data)
                    throw readSource?.err || "Error in reading file";
                const replaceData = readSource.data.replace(regex, updatedString);
                if (replaceData) {
                    const writeResp = await this.#writeFile(source, replaceData);
                    if (writeResp.err)
                        throw writeResp.err;
                }
                ;
                return { status: true };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async assignPort(port, source) {
            try {
                const path = this.#userPath(source)._server;
                const regex = /const\s+port\s*=\s*\d+\s*?;?/;
                const assignPort = await this.customiseValue(path, `const port = ${port};`, regex);
                if (!assignPort.status)
                    throw assignPort.error;
                return { status: true };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async assignDBName(dbName, source) {
            try {
                const path = this.#userPath(source)._db_shared;
                const regex = /const\s+dbName\s*=\s*[^;]+\s*?;?/;
                const updateString = `const dbName = "${dbName}";`;
                const assignDBName = await this.customiseValue(path, updateString, regex);
                if (!assignDBName.status)
                    throw assignDBName.error;
                const serverPath = this.#userPath(source)._server;
                const regexServer = /const\s+app\s*=\s*express\(\);?/;
                const prevLine = "const { connectDatabase } = require('./shared/db.shared');";
                const refLine = '\n\nconst app = express();';
                const newLine = '\n\nconnectDatabase()';
                const newUpdateString = prevLine + refLine + newLine;
                const assignServer = await this.customiseValue(serverPath, newUpdateString, regexServer);
                if (!assignServer.status)
                    throw assignServer.error;
                return { status: true };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async changePackageJSON(changeItem = 'name', destination = "", appName = "") {
            try {
                const source = this.#userPath(destination)['_package.json'];
                const readPackage = await this.#readFile(source);
                if (readPackage.err || !readPackage.data)
                    throw readPackage?.err || "Error in reading package.json";
                const packageJsonData = JSON.parse(readPackage.data);
                let version = parseInt(packageJsonData.version);
                if (changeItem === "version") {
                    packageJsonData.version = `${version + 1}.0.0`;
                }
                else {
                    packageJsonData.name = appName;
                }
                ;
                await this.#writeFile(source, JSON.stringify(packageJsonData, null, 2));
                return { status: true };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async getUserAppVersion(source = "") {
            try {
                const path = this.#userPath(source)['_package.json'];
                const readPackage = await this.#readFile(path);
                if (readPackage.err || !readPackage.data)
                    throw readPackage?.err || "Error in reading package.json";
                const parsedReadPackage = JSON.parse(readPackage.data);
                const version = parseInt(parsedReadPackage.version);
                return { status: true, data: version };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        async updateRouterVersion(source = "") {
            try {
                return { status: true };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
        // Function for finding database in the project
        async findDatabase(source = "") {
            try {
                const path = this.#userPath(source)._db_shared;
                const readData = await this.#readFile(path);
                if (readData.err || !readData.data)
                    throw readData.err;
                const model = this.#modelRegex(readData.data);
                if (!model)
                    throw "The Application is not configured with any database";
                return { status: true, data: model };
            }
            catch (error) {
                return { status: false, error };
            }
            ;
        }
        ;
    };
}
;
