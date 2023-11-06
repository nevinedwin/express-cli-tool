/**
 * Copyright (c) 2023-present, Nevin Edwin.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" resolution-mode="require"/>
import { CreateModuleFilesType } from "./lib/files.js";
export type DBType = "mongo" | "dynamo" | "none" | "";
declare const Main_base: {
    new (...args: any[]): {
        [x: string]: any;
        __filename: any;
        __dirname: any;
        "__#1@#userPath"(source: string): {
            '_package.json': string;
            _server: string;
            _db_shared: string;
        };
        "__#1@#modelRegex"(str?: string): string;
        "__#1@#readFile"(source: string): Promise<{
            err?: NodeJS.ErrnoException | null | undefined;
            data?: string | undefined;
        }>;
        "__#1@#writeFile"(destination: string, content: string): Promise<{
            err?: NodeJS.ErrnoException | null | undefined;
            data?: boolean | undefined;
        }>;
        checkFolderContains(templateName: string, destination: string): any[];
        copyTheDBFile(templateName?: string, dbname?: string): unknown[];
        getTemplatePath(libPath: string, templateName: string): string;
        createTemplate(templateName?: string, destination?: string, isExactTemplatePath?: boolean): void;
        createDBFile(destination: string, dbType: DBType): Promise<{
            status: boolean;
            error: NodeJS.ErrnoException | null | undefined;
        } | undefined>;
        readPackageJSON(): Promise<{
            status: boolean;
            error?: any;
            data?: string | undefined;
        }>;
        createModuleFiles(createModuleFilesParams: CreateModuleFilesType): Promise<{
            error?: any;
            status: boolean;
            moduleType: string;
            moduleName?: string | undefined;
        }>;
        "__#1@#createRouterInVersionFolder"({ source, moduleName, isVersioning }: import("./lib/files.js").createRouterInVersionFolderType): Promise<{
            status: boolean;
            error?: any;
        }>;
        customiseValue(source: string, updatedString: string | undefined, regex: RegExp): Promise<{
            status: boolean;
            error?: any;
        }>;
        assignPort(port: number, source: string): Promise<{
            status: boolean;
            error?: any;
        }>;
        assignDBName(dbName: string, source: string): Promise<{
            status: boolean;
            error?: any;
        }>;
        changePackageJSON(changeItem?: "name" | "version", destination?: string, appName?: string): Promise<{
            status: boolean;
            error?: any;
        }>;
        getUserAppVersion(source?: string): Promise<{
            status: boolean;
            error?: any;
            version?: number | undefined;
        }>;
        updateRouterVersion(source?: string): Promise<{
            status: boolean;
            error?: any;
        }>;
        findDatabase(source?: string): Promise<import("./lib/files.js").CommonReturnType>;
    };
} & {
    new (...args: any[]): {
        [x: string]: any;
        logFolderAlreadyExists(folderName: string): string;
        logFolderConflicts(path: string, folderList: [string]): string;
        logInvalidTemplate(value: string | number, type?: string): string;
        logModuleNameNotProvided(): string;
        logDbInfo(): string;
        logTemplateInfo(): string;
        logModuleResponse(error: Record<any, any>[]): {
            status: boolean;
            message: string;
        };
    };
} & {
    new (...args: any[]): {
        [x: string]: any;
        promptCreateTemplate(newTemplate?: string): Promise<[any, (string | undefined)?]>;
        PromptCreateFolder(): Promise<[any, (string | undefined)?]>;
        promptChoosePort(portParam?: number): Promise<[any, (number | undefined)?]>;
        promptChooseDB(db?: string): Promise<[any, (string | undefined)?]>;
        promptDBName(dbName?: string, projectName?: string): Promise<[any, (string | undefined)?]>;
    };
} & {
    new (): {};
};
export declare class Main extends Main_base {
    #private;
    args: Array<string>;
    private currentPath;
    private folderName;
    private template;
    private port;
    private dbName;
    private db;
    private destination;
    private isVersioningEnable;
    constructor(pss: Record<any, any>);
    createBoilerPlate(targetDir: string | undefined, options: Record<any, any>): Promise<void>;
    createModule(action: string): Promise<void>;
    showVerison(): Promise<void>;
    changeUserAppVersion(): Promise<void>;
}
export {};
