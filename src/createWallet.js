import { ethers } from "ethers";
import dayjs from 'dayjs';
import fs from 'fs'
import writeYamlFile from 'write-yaml-file';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from "./libs/config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createWallet() {
    const { walletCount } = config;
    const wallets = []
    for (let i = 0; i < walletCount; i++) {
        const { privateKey, address, mnemonic: { phrase } } = ethers.Wallet.createRandom();
        // console.log(privateKey, address, phrase);
        wallets.push({
            address,
            privateKey,
            mnemonicPhrase: phrase,
        })
    }
    const date = dayjs().format('YYYY-MM-DD');
    const walletFile = join(__dirname, '../accounts', `${date}_${Date.now()}.yml`);
    writeYamlFile(walletFile, {wallets: wallets}).then(() => {
        console.log('done')
    })
}
createWallet()


export default createWallet;
