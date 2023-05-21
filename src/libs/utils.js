import fs from 'fs';
export const createDirIfNotExists = dir =>
    !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined;
