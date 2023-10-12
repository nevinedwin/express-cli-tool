declare const CommandClass_base: {
    new (...args: any[]): {
        [x: string]: any;
        __filename: any;
        __dirname: any;
        checkFileExists(source: string, destination: string): any[];
        checkFolderContains(templateName: string, destination: string): any[];
        copyTheDBFile(templateName?: string, dbname?: string): unknown[];
        createTemplate(templateName?: string, destination?: string, flag?: boolean): void;
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
export declare class CommandClass extends CommandClass_base {
    private args;
    private currentPath;
    private folderName;
    private template;
    private port;
    private dbName;
    private db;
    private destination;
    constructor(pss: Record<any, any>);
    initCommand(): void;
    createBoilerPlate(targetDir: string | undefined, options: Record<any, any>): Promise<void>;
    prs(): void;
}
export {};
