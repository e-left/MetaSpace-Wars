import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { FC, useState, useEffect } from 'react';

import { NFT } from './NFT';
import { SKIN_TOKENS, NFTs } from './skins';

// Default styles
require('@solana/wallet-adapter-react-ui/styles.css');

// styles
require('./App.css');

// data cleaning
const skin_tokens_pubkeys: Array<PublicKey> = [];
SKIN_TOKENS.forEach(token => {
    skin_tokens_pubkeys.push(new PublicKey(token));
});

const nft_tokens_pubkeys: Array<PublicKey> = [];
NFTs.forEach(token => {
    nft_tokens_pubkeys.push(new PublicKey(token.token));
});

const App: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [nfts, changeNfts] = useState<{ skins: string[], others: string[] }>({ skins: [], others: [] });

    useEffect(() => {
        if (publicKey) {
            getNFTs();
        } else {
            changeNfts({ skins: [], others: [] });
        }
    }, [publicKey]);

    const getNFTs = async () => {
        if (publicKey) {
            let updatedSkins: string[] = [];
            let updatedOthers: string[] = [];

            const ownerInfo = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") });
            const mintAddresses = ownerInfo.value.map(value => value.account.data.parsed.info.mint);

            let ownedNFTs = [];

            for(let i = 0; i < mintAddresses.length; i++) {
                const largestAccounts = await connection.getTokenLargestAccounts(new PublicKey(mintAddresses[i]));
                const largestAccountInfo = await connection.getParsedAccountInfo(largestAccounts.value[0].address);
                const owner = (largestAccountInfo.value!.data as any).parsed.info.owner;
                if (owner === publicKey.toString()) {
                    ownedNFTs.push(mintAddresses[i]);
                }
            }


            ownedNFTs.forEach(address => {
                if (true) {
                    if (SKIN_TOKENS.includes(address)) {
                        // push to skins
                        updatedSkins.push(address);
                    } else {
                        // push to other nfts
                        updatedOthers.push(address);
                    }
                }

            });
            changeNfts({ skins: updatedSkins, others: updatedOthers })
        } else {
            changeNfts({ skins: [], others: [] });
        }
    }
    // add conditional rendering to display list of skins and list of non-skin tokens
    const renderedSkins = nfts.skins?.map(skin => <NFT key={skin} mint={skin} url={NFTs.filter(e => e.token === skin)[0].link} />);
    const renderedOthers = nfts.others?.map(other => <NFT key={other} mint={other} url={NFTs.filter(e => e.token === other)[0].link} />);
    const skinsText = publicKey ? "Skins:" : "";
    const othersText = publicKey ? "Other NFTs:" : "";

    return (
        <div>
            {skinsText}
            <br />
            {renderedSkins}
            {othersText}
            <br />
            {renderedOthers}
            <br />
            <WalletMultiButton />
        </div>
    );
};

export { App };
