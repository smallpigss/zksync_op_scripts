import fs from 'fs'
import YAML from 'yaml'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const loadWallets = (walletFile) => {
    const file = fs.readFileSync(walletFile, 'utf-8')

    const config = YAML.parse(file)

    return config.ignore ? [] : config.wallets;
}

export const loadAllWallets = () => {
    const basePath = join(__dirname, '../../accounts');
    const dirs = fs.readdirSync(basePath);
    let allWallets = [];

    if (dirs && dirs.length > 0) {
        for (let index = 0; index < dirs.length; index++) {
            const walletFile = basePath + '/' + dirs[index];
            const wallets = loadWallets(walletFile);
            allWallets = allWallets.concat(wallets);
        }
    }

    return allWallets;
}
