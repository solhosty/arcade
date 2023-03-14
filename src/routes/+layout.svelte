<script>
  // @ts-nocheck
  import Footer from "../components/Footer.svelte";
  import { onMount } from "svelte";
  import {
    WalletProvider,
    ConnectionProvider,
  } from "@svelte-on-solana/wallet-adapter-ui";
  import { walletStore as walletStore$ } from "@svelte-on-solana/wallet-adapter-core";
  import {
    PhantomWalletAdapter,
    BackpackWalletAdapter,
    LedgerWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
  } from "@solana/wallet-adapter-wallets";
  import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
  import { Connection } from "@solana/web3.js";
  import Wallet from "../components/Wallet.svelte";
  import {WalletMultiButton } from '@svelte-on-solana/wallet-adapter-ui';

  let nftImages = [];
  let nftAnimationUrls = [];
  let nftNames = [];

  let wallets;
  let walletConnected = false;
  const network =
    "https://light-autumn-sanctuary.solana-mainnet.discover.quiknode.pro/7779052a9ee594a9e6c09b7d5b28cca360f5685f/";
  // const network = clusterApiUrl('devnet');
  const localStorageKey = "solWalletAdapter";
  onMount(async () => {
    wallets = [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new LedgerWalletAdapter(),
    ];
    if (wallets.length == 0) {
      console.log("No wallets found.");
    }
    
  });
  $: {
    if ($walletStore$?.connected) {
      console.log("Wallet Connected.");
      walletConnected = true;
    } else {
      console.log("Wallet Not Connected.");
      walletConnected = false;
    }
  }
  let selectedAnimation = null;
  const getNFTs = async () => {
      if ($walletStore$?.connected) {
      const connection = new Connection(network);
      const wallet = $walletStore$;
      const identity = keypairIdentity(wallet.publicKey);
      const metaplex = new Metaplex(connection, wallet, identity);
      const myNfts = await metaplex.nfts().findAllByOwner({
        owner: wallet.publicKey,
      });
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
      ).then((nfts) => nfts.filter((nft) => nft !== null));
      for (let i = 0; i < nfts.length; i++) {
      nftAnimationUrls = nfts.map((nft) => nft.metadata.animation_url);
      nftImages = nfts.map((nft) => nft.metadata.image);
      nftNames = nfts.map((nft) => nft.metadata.name);
      console.log(nfts[i].metadata.animation_url);
    }
    }
  };
  onMount(async () => {
    await getNFTs();
    setInterval(async () => {
      await getNFTs();
    }, 10000);
  });
  
</script>

<body>
  <main>
    <slot/>
    {#if !$walletStore$?.connected}
  <div class="wallet-before">
    <div class="arcade-button"> 
<WalletProvider {localStorageKey} {wallets} autoConnect />
<ConnectionProvider {network} />
    <WalletMultiButton>
      Connect
    </WalletMultiButton>
    </div>
    <h2>connect wallet to enter the arcade.</h2>
  </div>
{/if}
    {#if $walletStore$.connected && selectedAnimation}
    <h3> now playing:</h3>
    <iframe src={selectedAnimation} title= ""  ></iframe>
      {/if}
      {#if $walletStore$.connected && nftAnimationUrls.length > 0} 
      <h4> select a game</h4>
      <div class="card-grid">
          {#each nftImages as nftImage, i}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="card" on:click={() => selectedAnimation = nftAnimationUrls[i]}>
              <img src={nftImage} alt="" />
                <div class="card-overlay">
                    <h5>{nftNames[i]}</h5>
                    </div>
            </div>
          {/each}
        </div>
        {/if}
  </main>
</body>


<style>
@import url("https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@1,700&family=Gajraj+One&family=Rubik+Mono+One&family=Shantell+Sans:ital,wght@1,700&display=swap");
.arcade-button {
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
h5 {
  font-family: "Exo 2", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  margin: auto;
  color: white;
}
.card-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
  max-width: 500px;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 25px;

}


.card {
  position: relative;
  margin: 10px;
  width: 100px;
  height: 100px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 10px;
  transition: transform 0.3s, border 0.3s;
}
.card:hover {
  transform: translateY(-3px);
  border: 3px white solid;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover .card-overlay {
  opacity: 1;
}

iframe {
  width: 40%;
  min-width: 390px;
  margin: auto;
  height: 80%;
  margin-top: 0%;
  display: flex;
  border-radius: 25px;
  margin-bottom: 3%;
  border: none;
}
  body {
    height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: auto;
    background-image: radial-gradient(#e83232, #eb5555);
  }
  main {
    height: 100%;
    width: 100%;
    margin: auto;
  }
  h3 {
    text-align: center;
    font-family: "Exo 2", sans-serif;
    color: white;
    font-size: 2rem;
    margin-top: 0%;
    margin-bottom: 2%;
  }
  h4 {
    margin-top: 0%;
    font-family: "Exo 2", sans-serif;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 2%;
    color: white;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  h2 {
    font-family: "Exo 2", sans-serif;
    font-size: 2rem;
    text-align: center;
    margin-top: 0%;
    color: white;
  }
  .wallet-before {
    position: relative;
    top: 20%;
  }
  
</style>
