import * as zksyncEra from 'zksync-web3'
import * as ethers from 'ethers';

const zkSyncProvider = new zksyncEra.Provider('https://mainnet.era.zksync.io');
const ethProvider = ethers.getDefaultProvider('mainnet');

export const transfer = async ({
                             wallet,
                             amount,
                             tokenAddress = zksyncEra.utils.ETH_ADDRESS,
                             recipientAddress,
                         }) => {
    // const wallet = new zksyncEra.Wallet(privateKey, zkSyncProvider, ethProvider);
    try {
        const _amount = ethers.utils.parseUnits(amount.toString(), 18);
        const to = recipientAddress ?? wallet.address;
        const transfer = await wallet.transfer({
            to,
            token: tokenAddress,
            amount: _amount,
        });
        const committedTxReceipt = await transfer.wait();
        console.log(`${wallet.address} New Transaction ${committedTxReceipt.transactionHash}`);
    } catch (err) {
        console.log('transfer failed', err);
    }
}

export const interaction = async ({ privateKey }) => {
    const wallet = new zksyncEra.Wallet(privateKey, zkSyncProvider, ethProvider);
    const balanceNum = await wallet.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceNum));
    if (balance === 0) {
        console.log(`${wallet.address} 余额不足，跳过交互`);
        return
    }

    await transfer({
        wallet,
        amount: 0.0001,
    })
}
