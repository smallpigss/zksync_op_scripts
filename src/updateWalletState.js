import * as zksyncLite from 'zksync';
import * as zksyncEra from 'zksync-web3'
import * as ethers from 'ethers';
import { loadAllWallets } from "./libs/loadWallets.js";
import {updateWalletStatus} from "./libs/notion.js";

const liteProvider = await zksyncLite.getDefaultProvider('mainnet');
// const ethersProvider = await ethers.getDefaultProvider('mainnet');
const eraProvider = new zksyncEra.Provider('https://mainnet.era.zksync.io')
const ethProvider = ethers.getDefaultProvider('mainnet');

export const updateWalletState = async () => {
    const allWallets = loadAllWallets();
    for (let index = 0; index < allWallets.length; index++) {
        const { privateKey, address } = allWallets[index];
        const signer = new ethers.Wallet(privateKey, ethProvider);
        const liteWallet = await zksyncLite.Wallet.fromEthSigner(signer, liteProvider);
        const eraWallet = new zksyncEra.Wallet(privateKey, eraProvider, ethProvider);
        // console.log(`查询中 ${address}`);
        const [liteNonce, eraNonce] = await Promise.all([liteWallet.getNonce(), eraWallet.getNonce()]);
        const [liteBalanceNum, eraBalanceNum] = await Promise.all([liteWallet.getBalance('ETH'), eraWallet.getBalance()]);

        const liteBalance = Number(liteProvider.tokenSet.formatToken('ETH', liteBalanceNum));
        const eraBalance = Number(ethers.utils.formatEther(eraBalanceNum));
        console.log(address, liteNonce, eraNonce, liteBalance, eraBalance);
        await updateWalletStatus(address, liteNonce, eraNonce, liteBalance, eraBalance);
    }
}

updateWalletState();
