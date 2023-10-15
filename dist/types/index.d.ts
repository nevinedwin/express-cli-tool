/**
 * Copyright (c) 2023-present, Nevin Edwin.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" resolution-mode="require"/>
declare const Main_base: {
    new (...args: any[]): {
        [x: string]: any;
        __filename: any;
        __dirname: any;
        "__#1@#readFile"(source: string): Promise<{
            err?: NodeJS.ErrnoException | null | undefined;
            data?: string | undefined;
        }>;
        "__#1@#writeFile"(destination: string, content: string): Promise<{
            err?: NodeJS.ErrnoException | null | undefined;
            data?: boolean | undefined;
        }>;
        checkFileExists(source: string, destination: string): any[];
        checkFolderContains(templateName: string, destination: string): any[];
        copyTheDBFile(templateName?: string, dbname?: string): unknown[];
        getTemplatePath(libPath: string, templateName: string): string;
        createTemplate(templateName?: string, destination?: string, isExactTemplatePath?: boolean): void;
        createDBFile(destination: string, dbType: string): Promise<{
            status: boolean;
            error: (message?: any, ...optionalParams: any[]) => void;
        } | undefined>;
        readPackageJSON(): Promise<{
            status: boolean;
            error?: any;
            data?: string | undefined;
        }>;
    };
} & {
    new (...args: any[]): {
        [x: string]: any;
        logFolderAlreadyExists(folderName: string): string;
        logFolderConflicts(path: string, folderList: [string]): string;
        logInvalidTemplate(value: string | number, type?: string): string;
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
    constructor(pss: Record<any, any>);
    createBoilerPlate(targetDir: string | undefined, options: Record<any, any>): Promise<void>;
    createModule(action: string): Promise<void>;
    showVerison(): Promise<void>;
}
export {};
