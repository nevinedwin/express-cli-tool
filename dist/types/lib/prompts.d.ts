import { CommonReturnType } from './files.js';
type PromptType = {
    type: "input" | "number" | "confirm" | "list" | "rawlist" | "expand" | "checkbox" | "password" | "editor";
    name: string;
    message: string | Function;
    choices?: Array<string | number> | Function;
    defaultValue?: string | number | boolean | Array<any> | Function;
    validate?: Function;
    when?: boolean;
};
type DBType = "mongo" | "dynamo" | "none" | string;
type Class = new (...args: any[]) => any;
export declare function PromptClass<Base extends Class>(base: Base): {
    new (...args: any[]): {
        [x: string]: any;
        promptCreateTemplate(newTemplate?: string): Promise<CommonReturnType>;
        PromptCreateFolder(): Promise<CommonReturnType>;
        promptChoosePort(portParam?: number): Promise<CommonReturnType>;
        promptChooseDB(db?: DBType): Promise<CommonReturnType>;
        promptDBName(dbName?: string, projectName?: string): Promise<CommonReturnType>;
    };
} & Base;
export declare function prompt({ type, name, message, choices, validate, defaultValue, when }: PromptType): Promise<[any, string?]>;
export declare function __toPlainText(txt: string): string;
export {};
