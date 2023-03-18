<script>
  // @ts-nocheck
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
  import { WalletMultiButton } from "@svelte-on-solana/wallet-adapter-ui";
  import Footer from "../components/Footer.svelte";
  import { browser } from '$app/environment';
  import { Buffer } from 'buffer';
  let nftImages = [];
  let nftAnimationUrls = [];
  let nftNames = [];
  let nftDescriptions = [];
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
        nftDescriptions = nfts.map((nft) => nft.metadata.description);
      }
    }
  };
  onMount(async () => {
    if(browser) {
            window.Buffer = Buffer;
            setInterval(() => {
              getNFTs();
            }, 10000);
        }
  });
</script>

<body>
  <main>
    <slot />
    {#if !$walletStore$?.connected}
      <div class="arcade-intro">
        <h1>minion arcade</h1>
        <div class="wallet-before">
          <div class="arcade-button">
            <WalletProvider {localStorageKey} {wallets} autoConnect />
            <ConnectionProvider {network} />
            <WalletMultiButton />
          </div>
          <h2>connect to enter the arcade.</h2>
        </div>
      </div>
    {/if}
    {#if $walletStore$?.connected && !selectedAnimation && nftAnimationUrls.length == 0}
    <div class="arcade-intro">
      <h1>minion arcade</h1>
        <h2 class="loading">...loading game tokens</h2>
    </div>
    {/if}
    {#if ($walletStore$.connected && selectedAnimation) || nftAnimationUrls.length > 0}
      <h1 class="after">minion arcade</h1>
    {/if}
    {#if $walletStore$.connected && selectedAnimation}
      <div class="iframe-container">
        <iframe src={selectedAnimation} title="" />
        <div class="iframe-text">
          <h3>playing: {nftNames[nftAnimationUrls.indexOf(selectedAnimation)]} </h3>
          <h6>
            {nftDescriptions[nftAnimationUrls.indexOf(selectedAnimation)]}
          </h6>
        </div>
      </div>
    {/if}
    {#if $walletStore$.connected && nftAnimationUrls.length > 0}
      <h4>select a game</h4>
      <div class="card-grid">
        {#each nftImages as nftImage, i}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="card"
            on:click={() => (selectedAnimation = nftAnimationUrls[i])}
          >
            <img src={nftImage} alt="" />
            <div class="card-overlay">
              <h5>{nftNames[i]}</h5>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
  <Footer/>
</body>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@1,700&family=Gajraj+One&family=Rubik+Mono+One&family=Shantell+Sans:ital,wght@1,700&display=swap");
  .arcade-button {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .after {
    margin-top: 0%;
  }
  .arcade-intro {
    border: 5px white solid;
    width: 50%;
    margin: auto;
    justify-content: center;
    align-items: center;
    margin-top: 15%;
    border-radius: 25px;
    box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);
  }
  .loading {
    position: relative;
    top: 20%;
  }
  .iframe-text {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: auto;
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
    margin-bottom: 10%;
    border: 4px white solid;
    max-width: 500px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 25px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.2);
  }
  .iframe-container {
    margin: auto;
    display: flex;
    border: 4px white solid;
    flex-direction: column;
    margin-top: 0%;
    margin-bottom: 2%;
    width: 600px;
    max-width: 100%;
    height: 800px;
    border-radius: 25px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.2);
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url("/loading.svg") repeat;
    background-size: cover;
  }
  iframe {
    width: 60%;
    min-width: 95%;
    margin: auto;
    height: 100%;
    margin-top: 3%;
    display: flex;
    border-radius: 25px;
    margin-bottom: 0%;
    border: none;
  }

  .card {
    position: relative;
    margin: 10px;
    margin-top: 5%;
    width: 100px;
    max-width: 95%;
    height: 100px;
    overflow: hidden;
    cursor: pointer;
    border-radius: 10px;
    transition: transform 0.2s ease-in-out;
  }
  .card:hover {
    transform: translateY(-10px);
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

  body {
    height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: auto;
    padding: 0;
    background-image: radial-gradient(#e83232, #eb5d5d);
  }

  main {
    height: 100%;
    width: 100%;
    margin: auto;
  }
  h3 {
    text-align: left;
    font-family: "Exo 2", sans-serif;
    color: white;
    font-size: 2rem;
    margin-top: 0%;
    margin-bottom: 2%;
    text-shadow:0 5px 0 #3B3B3B;
    margin: auto;
  }
  h6 {
    text-align: center;
    font-family: "Exo 2", sans-serif;
    color: white;
    font-size: 1rem;
    margin-top: 0%;
    text-shadow:0 5px 0 #3B3B3B;
    width: 100%;
    margin-right: 20px;
    margin-bottom: 2%;
    font-style: italic;
  }
  h4 {
    margin-top: 0%;
    font-family: "Exo 2", sans-serif;
    font-size: 2rem;
    text-shadow:0 5px 0 #3B3B3B;
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
    margin-top: 1%;
    color: white;
    text-shadow:0 5px 0 #3B3B3B;
  }
  .wallet-before {
    position: relative;
    top: 20%;
    z-index: 1000;
  }
  h1 {
    font-family: "Gajraj One", cursive;
    font-size: 4rem;
    text-align: center;
    text-shadow:0 5px 0 #3B3B3B;
    color: white;
    margin-bottom: 1%;
    min-width: 100%;
    margin-top: 5%;
  }
  @media (max-width: 760px) {
    .wallet-before {
      position: relative;
      top: 0%;
    }
    h1 {
      font-size: 4.5rem;
    }
    .arcade-intro {
      width: 85%;
      margin-top: 40%;
    }
  }
</style>
