import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
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
        checkFileExists(source, destination) {
            try {
                const newDestination = destination.slice(0, destination.lastIndexOf("/"));
                if (newDestination !== source && fs.existsSync(destination)) {
                    return [null, true];
                }
                ;
                return [null, false];
            }
            catch (er) {
                return [er];
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
        createTemplate(templateName = "", destination = "", flag = false) {
            let source = "";
            if (!flag) {
                source = `${this.__dirname.slice(0, this.__dirname.lastIndexOf("\lib"))}/templates/${templateName}`;
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
    };
}
;
