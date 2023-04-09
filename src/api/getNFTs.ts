// @ts-nocheck
import { walletStore as walletStore$ } from "@svelte-on-solana/wallet-adapter-core";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";

const network = "https://light-autumn-sanctuary.solana-mainnet.discover.quiknode.pro/7779052a9ee594a9e6c09b7d5b28cca360f5685f/";
let wallet;
if (walletStore$.connected) {
    wallet = walletStore$.wallet;
  }
let nftImages = [];
  let nftAnimationUrls = [];
  let nftNames = [];
  let nftDescriptions = [];
  let loading = true;
  const getNFTs = async () => {
      const connection = new Connection(network);
      const identity = keypairIdentity(wallet.publicKey);
      const metaplex = new Metaplex(connection, wallet, identity);
      const myNfts = await metaplex.nfts().findAllByOwner({
        owner: wallet.publicKey,
      });
      const nfts = await Promise.all(
        myNfts.map(async (nft) => {
          const response = await fetch(nft.uri);
          const metadata = await response.json();
          if (metadata.animation_url && metadata.image && games.includes(metadata.name)) {
            return {
              nft,
              metadata,
            };
          } else {
            return null;
          }
        })
      ).then((nfts) => nfts.filter((nft) => nft));
      for (let i = 0; i < nfts.length; i++) {
        nftAnimationUrls = nfts.map((nft) => nft.metadata.animation_url);
        nftImages = nfts.map((nft) => nft.metadata.image);
        nftNames = nfts.map((nft) => nft.metadata.name);
        nftDescriptions = nfts.map((nft) => nft.metadata.description);
      }
      loading = false;

    };
    export { nftImages, nftAnimationUrls, nftNames, nftDescriptions, loading, getNFTs}