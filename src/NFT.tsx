import React, { FC, useEffect, useState } from 'react';

require('./NFT.css');

const NFT: FC<{ url: string, mint: string }> = ({ url, mint }) => {
    let [name, changeName] = useState("blank");
    let [imageUri, changeImageUri] = useState("");

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                changeName(data.name);
                changeImageUri(data.uri);
            });
    }, []);

    return (
        <div className="nft">
            <div className="nfttext">
                Name: {name}
                </div>
            <img width={100} height={100} className="nftimage" src={imageUri} />
        </div>
    );
}

export { NFT };
