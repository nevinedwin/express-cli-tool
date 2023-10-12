type PromptType = {
    type: "input" | "number" | "confirm" | "list" | "rawlist" | "expand" | "checkbox" | "password" | "editor";
    name: string;
    message: string | Function;
    choices?: Array<string | number> | Function;
    defaultValue?: string | number | boolean | Array<any> | Function;
    validate?: Function;
    when?: boolean;
};
type Class = new (...args: any[]) => any;
export declare function prompt({ type, name, message, choices, validate, defaultValue, when }: PromptType): Promise<[any, string?]>;
export declare function __toPlainText(txt: string): string;
export declare function PromptClass<Base extends Class>(base: Base): {
    new (...args: any[]): {
        [x: string]: any;
        promptCreateTemplate(newTemplate?: string): Promise<[any, string?]>;
        PromptCreateFolder(): Promise<[any, string?]>;
        promptChoosePort(portParam?: number): Promise<[any, number?]>;
        promptChooseDB(db?: string): Promise<[any, string?]>;
        promptDBName(dbName?: string, projectName?: string): Promise<[any, string?]>;
    };
} & Base;
export {};
