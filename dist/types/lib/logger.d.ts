import { CommonReturnType } from "./files.js";
type Class = new (...args: any[]) => any;
export declare function LoggerClass<Base extends Class>(base: Base): {
    new (...args: any[]): {
        [x: string]: any;
        logFolderAlreadyExists(folderName: string): string;
        logFolderConflicts(path: string, folderList: [string]): string;
        logInvalidTemplate(value: string | number, type?: string): string;
        logModuleNameNotProvided(): string;
        logPortNotProvided(): string;
        logDbInfo(): string;
        logTemplateInfo(): string;
        logModuleResponse(error: Array<Record<any, any>>): CommonReturnType;
        createValidation(options: Record<any, any>): string | null;
        portValidation(port: any): string | undefined;
        logSuccessInstallation(appName: string): string;
        logEnvCreationMessage(): string;
        logPortChangeSuccess(port: number): string;
    };
} & Base;
export {};
