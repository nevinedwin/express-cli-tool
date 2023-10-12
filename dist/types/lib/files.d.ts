type Class = new (...args: any[]) => any;
export declare function File<Base extends Class>(base: Base): {
    new (...args: any[]): {
        [x: string]: any;
        __filename: any;
        __dirname: any;
        checkFileExists(source: string, destination: string): Array<any>;
        checkFolderContains(templateName: string, destination: string): Array<any>;
        copyTheDBFile(templateName?: string, dbname?: string): unknown[];
        createTemplate(templateName?: string, destination?: string, flag?: boolean): void;
    };
} & Base;
export {};
