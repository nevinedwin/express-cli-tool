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
        "mongo",
        "dynamo",
        "none"
    ],
    templates: {
        "Express-JS": 'express-template',
        "Express-TS": 'express-ts-template',
        "expressjs": 'express-template',
        "expressts": 'express-ts-template'
    },
    dbPackages: {
        "mongo": "mongoose",
        "dynamo": "aws-sdk"
    }
};
