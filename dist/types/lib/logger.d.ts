type Class = new (...args: any[]) => any;
export declare function LoggerClass<Base extends Class>(base: Base): {
    new (...args: any[]): {
        [x: string]: any;
        logFolderAlreadyExists(folderName: string): string;
        logFolderConflicts(path: string, folderList: [string]): string;
        logInvalidTemplate(value: string | number, type?: string): string;
        logModuleNameNotProvided(): string;
        logDbInfo(): string;
        logTemplateInfo(): string;
        logModuleResponse(error: Array<Record<any, any>>): {
            status: boolean;
            message: string;
        };
    };
} & Base;
export {};
