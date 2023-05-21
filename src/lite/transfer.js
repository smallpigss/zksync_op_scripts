import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadWallets } from "../libs/loadWallets.js";


const __dirname = dirname(fileURLToPath(import.meta.url));

export const transfer = () => {
    const basePath = join(__dirname, '../../accounts');
    const dirs = fs.readdirSync(basePath);

    if (dirs && dirs.length > 0) {
        for (let index = 0; index < dirs.length; index++) {
            const walletFile = basePath + '/' + dirs[index];
            const wallets = loadWallets(walletFile);
            console.log(wallets);
        }
    }
    console.log(basePath);
}

transfer();
