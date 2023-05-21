import { interaction as eraInteraction } from "./zkSyncEra.js";
import {loadAllWallets} from "./libs/loadWallets.js";

export const interaction = async () => {
    const wallets = loadAllWallets();
    for (let index = 0; index < wallets.length; index++) {
        const { privateKey, address } = wallets[index];
        await eraInteraction({
            privateKey
        });
    }
}

interaction();
