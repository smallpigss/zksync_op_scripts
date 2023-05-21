import fs from 'fs'
import YAML from 'yaml'


export const loadWallets = (walletFile) => {
    const file = fs.readFileSync(walletFile, 'utf-8')

    return YAML.parse(file)?.wallets;
}
