import chalk from "chalk";
export const constants = {
    templateChoices: [
        `${chalk.yellow("Express-JS")}`,
        `${chalk.blue("Express-TS")}`,
        // `${chalk.blue("React-JS")}`,
        // `${chalk.yellow("React-TS")}`
    ],
    plainTemplates: [
        "expressjs",
        "expressts"
    ],
    db: [
        "mongodb",
        "dynamodb",
        "no-db"
    ],
    templates: {
        "Express-JS": 'express-template',
        "Express-TS": 'express-ts-template',
        "expressjs": 'express-template',
        "expressts": 'express-ts-template'
    }
};
