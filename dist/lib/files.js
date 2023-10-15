import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { error } from 'console';
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
        checkFileExists(source, destination) {
            try {
                const newDestination = destination;
                // if (newDestination !== source && fs.existsSync(destination)) {
                //   return [null, true];
                // };
                return { isExists: false };
            }
            catch (er) {
                return { isExists: true, error };
            }
            ;
        }
        ;
        checkFolderContains(templateName, destination) {
            try {
                if (!fs.existsSync(destination)) {
                    return [null, []];
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
                return [null, duplicateFileArray];
            }
            catch (e) {
                console.log(e);
                return [e];
            }
        }
        ;
        copyTheDBFile(templateName = "", dbname = "") {
            try {
                const templatePath = this.__dirname.replace(/\/lib$/, `/templates/${templateName}`);
                const databasePath = this.__dirname.replace(/\/lib$/, `/templates/dbtemplates/${dbname}.js`);
                const destinationPath = path.join(templatePath, 'shared', 'db.shared.js');
                if (!fs.existsSync(destinationPath)) {
                    new Promise((resolve, reject) => {
                        fs.copyFileSync(databasePath, destinationPath);
                    });
                }
                return [null, true];
            }
            catch (error) {
                return [error];
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
        async createDBFile(destination, dbType) {
            const source = this.getTemplatePath(this.__dirname, `dbTemplates/${dbType}.config.js`);
            const newDestination = `${destination}/shared/db.shared.js`;
            const readResult = await this.#readFile(source);
            if (readResult.err) {
                return { status: false, error };
            }
            ;
            readResult.data && await this.#writeFile(newDestination, readResult.data);
        }
        ;
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
        async checkModuleExists(source, isModel = false) {
            try {
                const folderArray = ['controller', 'helper', 'router'];
                if (isModel)
                    folderArray.push('model');
                console.log(folderArray.length);
                console.log(folderArray);
                const { isExists, error } = this.checkFileExists(source, source);
                if (error)
                    throw error;
            }
            catch (error) {
                return { error, isExists: true };
            }
            ;
        }
        ;
        async createModel(modelName, destination, type) {
            try {
                const template = constants.modelTemplate(modelName, type);
                if (!fs.existsSync(`${destination}/model`)) {
                    fs.mkdirSync(`${destination}/model`);
                }
                ;
                await this.#writeFile(`${destination}/model/${modelName}.model.js`, template);
                return { status: true };
            }
            catch (error) {
                return { error, status: false };
            }
            ;
        }
        ;
    };
}
;
