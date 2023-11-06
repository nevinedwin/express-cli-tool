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
            _server: string;
            _db_shared: string;
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
        checkFolderContains(templateName: string, destination: string): Array<any>;
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
            data?: string;
        }>;
        createModuleFiles(createModuleFilesParams: CreateModuleFilesType): Promise<{
            error?: any;
            status: boolean;
            moduleType: string;
            moduleName?: string;
        }>;
        "__#1@#createRouterInVersionFolder"({ source, moduleName, isVersioning }: createRouterInVersionFolderType): Promise<{
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
        changePackageJSON(changeItem?: 'name' | 'version', destination?: string, appName?: string): Promise<{
            status: boolean;
            error?: any;
        }>;
        getUserAppVersion(source?: string): Promise<{
            status: boolean;
            error?: any;
            version?: number;
        }>;
        updateRouterVersion(source?: string): Promise<{
            status: boolean;
            error?: any;
        }>;
        findDatabase(source?: string): Promise<CommonReturnType>;
    };
} & Base;
export {};
