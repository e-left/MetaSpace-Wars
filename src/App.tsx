import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { FC, useState } from 'react';

// Default styles
require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [balance, changeBalance] = useState(0);
    
    
    const refreshBalance = async () => {
            if(!publicKey) {
                // no wallet connected
                throw new WalletNotConnectedError();
            }

            const balance = await connection.getBalance(publicKey);
            changeBalance(balance/LAMPORTS_PER_SOL);
            } 


    return (
            <div>
            <div>Balance: {balance} SOL</div>
            <button onClick={refreshBalance} disabled={!publicKey}>Get Balance</button> 
            <br />
            <WalletMultiButton />
            </div>
           );
};

export { App };
