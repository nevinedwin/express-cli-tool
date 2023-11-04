/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { error } from 'console';
type Class = new (...args: any[]) => any;
type DBType = "mongo" | "dynamo" | "none" | string;
export type CreateModuleFilesType = {
    moduleType: "controller" | "model" | "router" | "helper";
    moduleName: string;
    destination: string;
    modelType?: DBType;
};
export declare function File<Base extends Class>(base: Base): {
    new (...args: any[]): {
        [x: string]: any;
        __filename: any;
        __dirname: any;
        "__#1@#readFile"(source: string): Promise<{
            err?: NodeJS.ErrnoException | null;
            data?: string;
        }>;
        "__#1@#writeFile"(destination: string, content: string): Promise<{
            err?: NodeJS.ErrnoException | null;
            data?: boolean;
        }>;
        checkFileExists(source: string, destination: string): {
            error?: any;
            isExists: boolean;
        };
        checkFolderContains(templateName: string, destination: string): Array<any>;
        copyTheDBFile(templateName?: string, dbname?: string): unknown[];
        getTemplatePath(libPath: string, templateName: string): string;
        createTemplate(templateName?: string, destination?: string, isExactTemplatePath?: boolean): void;
        createDBFile(destination: string, dbType: DBType): Promise<{
            status: boolean;
            error: (message?: any, ...optionalParams: any[]) => void;
        } | undefined>;
        readPackageJSON(): Promise<{
            status: boolean;
            error?: any;
            data?: string;
        }>;
        checkModuleExists(source: string, isModel?: boolean): Promise<{
            error: unknown;
            isExists: boolean;
        } | undefined>;
        createModel(modelName: string, destination: string, type: string): Promise<{
            error?: any;
            status: boolean;
        }>;
        createModuleFiles(createModuleFilesParams: CreateModuleFilesType): Promise<{
            error?: any;
            status: boolean;
        }>;
    };
} & Base;
export {};
