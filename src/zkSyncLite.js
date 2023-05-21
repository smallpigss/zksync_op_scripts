import * as zksync from 'zksync'
import * as ethers from 'ethers';
import web3Utils from "web3-utils";
import config from "./libs/config.js";
import cids from "./cids.js";

const zkSyncProvider = await zksync.getDefaultProvider('mainnet');
const ethProvider = ethers.getDefaultProvider('mainnet');
const { lite: { mintNum: liteMintNum, transferNumber }} = config;

export const transfer = async ({
                                   wallet,
                                   amount,
                                   tokenSymbol = 'ETH',
                                   recipientAddress,
                               }) => {
    // const wallet = new zksyncEra.Wallet(privateKey, zkSyncProvider, ethProvider);
    try {
        const _amount = ethers.utils.parseUnits(amount.toString(), 18);
        const to = recipientAddress ?? wallet.address();
        const transfer = await wallet.syncTransfer({
            to,
            token: tokenSymbol,
            amount: _amount,
        });
        const committedTxReceipt = await transfer.awaitReceipt();
        console.log(`${wallet.address()} New Transaction`, committedTxReceipt);
    } catch (err) {
        console.log('transfer failed', err);
    }
}

export const mintNft = async  ({ wallet }) => {
    try {
        const [isSigningKeySet, getAccountId] = await Promise.all([
            wallet.isSigningKeySet(),
            wallet.getAccountId()
        ]);
        if (!isSigningKeySet) {
            if (getAccountId === undefined) {
                throw new Error('Unknown account');
            }
            await wallet.setSigningKey({
                feeToken: 'ETH',
                ethAuthType: 'ECDSA'
            });
        }
        const address = wallet.address();
        console.log(`will mint nft for ${address}`)
        const { totalFee: fee } = await zkSyncProvider.getTransactionFee(
            "MintNFT",
            address,
            'ETH'
        );

        let randomIndex = [];
        for (let i = 0; i < cids.length; i++) {
            randomIndex.push(i);
        }
        randomIndex = randomIndex.sort(() => Math.random() - 0.5);
        for (let exponent = 0; exponent < liteMintNum; exponent++) {
            const CID = cids[randomIndex[exponent]].CID;
            const nftIdentifier = "0x" + web3Utils.soliditySha3(CID).slice(2);
            const { state, txHash } = await wallet.mintNFT({
                contentHash: nftIdentifier,
                recipient: address,
                feeToken: 'ETH',
                fee,
            });

            console.log(`State: ${state}, TxHash: ${txHash}`)
        }
    } catch (err) {
        console.log('${wallet.address()} mintNft failed', err);
    }
}

export const interaction = async ({ privateKey }) => {
    const signer = new ethers.Wallet(privateKey, ethProvider);
    const wallet = await zksync.Wallet.fromEthSigner(signer, zkSyncProvider);
    const accountStatus = await wallet.getAccountState();
    if (accountStatus.accountType === null) {
        console.log(`${wallet.address()} 被锁定`)
        await wallet.setSigningKey({
            feeToken: 'ETH',
            ethAuthType: 'ECDSA'
        });
    }
    const balanceNum = await wallet.getBalance('ETH');
    const balance = Number(zkSyncProvider.tokenSet.formatToken('ETH', balanceNum));
    if (balance === 0) {
        console.log(`zkSync Lite ${wallet.address()} 余额不足，跳过交互`);
        return
    }

    // await transfer({
    //     wallet,
    //     amount: transferNumber,
    // })
    await mintNft({ wallet });
}
