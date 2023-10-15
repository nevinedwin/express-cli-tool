/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { error } from 'console';
type Class = new (...args: any[]) => any;
type DBType = "mongo" | "dynamo" | "none" | string;
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
        checkFileExists(source: string, destination: string): Array<any>;
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
    };
} & Base;
export {};
