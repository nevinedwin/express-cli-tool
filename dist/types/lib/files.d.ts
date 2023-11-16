/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { DBType } from '../index.js';
type Class = new (...args: any[]) => any;
export type CreateModuleFilesType = {
    moduleType: "controller" | "model" | "router" | "helper";
    moduleName: string;
    destination: string;
    modelType?: DBType;
    isVersioning?: boolean;
    ignoreExistance?: boolean;
};
export type createRouterInVersionFolderType = {
    source: string;
    isVersioning: boolean;
    moduleName: string;
};
export type CommonReturnType = {
    status: boolean;
    error?: any;
    data?: any;
    message?: any;
};
export declare function File<Base extends Class>(base: Base): {
    new (...args: any[]): {
        [x: string]: any;
        __filename: any;
        __dirname: any;
        "__#1@#userPath"(source: string): {
            '_package.json': string;
            _main: string;
            _db_shared: string;
            _env: string;
        };
        "__#1@#modelRegex"(str?: string): string;
        "__#1@#readFile"(source: string): Promise<{
            err?: NodeJS.ErrnoException | null;
            data?: string;
        }>;
        "__#1@#writeFile"(destination: string, content: string): Promise<{
            err?: NodeJS.ErrnoException | null;
            data?: boolean;
        }>;
        checkFolderContains(templateName: string, destination: string): CommonReturnType;
        getTemplatePath(libPath: string, templateName: string): string;
        createTemplate(templateName?: string, destination?: string, isExactTemplatePath?: boolean): void;
        createDBFile(destination: string, dbType: DBType): Promise<CommonReturnType>;
        readPackageJSON(): Promise<{
            status: boolean;
            error?: any;
            data?: string;
        }>;
        createModuleFiles(createModuleFilesParams: CreateModuleFilesType): Promise<{
            error?: any;
            status: boolean;
            moduleType: string;
            moduleName?: string;
        }>;
        "__#1@#createRouterInVersionFolder"({ source, moduleName, isVersioning }: createRouterInVersionFolderType): Promise<CommonReturnType>;
        customiseValue(source: string, updatedString: string | undefined, regex: RegExp): Promise<CommonReturnType>;
        assignPort(port: number, source: string, createFile?: boolean): Promise<CommonReturnType>;
        assignDBName(dbName: string, source: string, createFile?: boolean): Promise<CommonReturnType>;
        changePackageJSON(changeItem?: 'name' | 'version', destination?: string, appName?: string): Promise<CommonReturnType>;
        getUserAppVersion(source?: string): Promise<CommonReturnType>;
        updateRouterVersion(source?: string): Promise<CommonReturnType>;
        findDatabase(source?: string): Promise<CommonReturnType>;
    };
} & Base;
export {};
