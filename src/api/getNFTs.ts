const express = require('express');
const { Connection, clusterApiUrl } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');

const app = express();
const port = 5173;
const network = "https://light-autumn-sanctuary.solana-mainnet.discover.quiknode.pro/7779052a9ee594a9e6c09b7d5b28cca360f5685f/";
export default function getNFTs() {
  app.get('/src/api/getNFTs', async (req, res) => {
    const wallet = req.query.wallet; // the user's connected wallet
    const connection = new Connection(network);
    const identity = keypairIdentity(wallet);
    const metaplex = new Metaplex(connection, wallet, identity);
    const myNfts = await metaplex.nfts().findAllByOwner({ owner: wallet });
    const nfts = await Promise.all(
      myNfts.map(async (nft) => {
        const response = await fetch(nft.uri);
        const metadata = await response.json();
        if (metadata.animation_url && metadata.image) {
          return {
            nft,
            metadata,
          };
        } else {
          return null;
        }
      })
    ).then((nfts) => nfts.filter((nft) => nft));
    res.json(nfts);
  });
  app.listen(port, () => {
    
  });
}
export {getNFTs};