import fs from 'fs';
export const createDirIfNotExists = dir =>
    !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined;

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
