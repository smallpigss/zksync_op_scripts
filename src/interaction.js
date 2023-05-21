import argv from 'process.argv';
import { interaction as eraInteraction } from "./zkSyncEra.js";
import { interaction as liteInteraction } from "./zkSyncLite.js";
import {loadAllWallets} from "./libs/loadWallets.js";

const processArgv = argv(process.argv.slice(2));

const config = processArgv({
    zkNet: 'all',
});

export const interaction = async () => {
    const wallets = loadAllWallets();
    for (let index = 0; index < wallets.length; index++) {
        const { privateKey, address } = wallets[index];
        if (['all', 'era'].indexOf(config.zkNet) >= 0) {
            await eraInteraction({
                privateKey,
            });
        }
        if (['all', 'lite'].indexOf(config.zkNet) >= 0) {
            await liteInteraction({
                privateKey,
            })
        }
    }
}

interaction();
