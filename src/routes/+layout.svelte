<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import {
    WalletProvider,
    ConnectionProvider,
    WalletMultiButton,
  } from "@svelte-on-solana/wallet-adapter-ui";
  import { walletStore as walletStore$ } from "@svelte-on-solana/wallet-adapter-core";
  import {
    PhantomWalletAdapter,
    BackpackWalletAdapter,
    LedgerWalletAdapter,
    SolflareWalletAdapter,
  } from "@solana/wallet-adapter-wallets";
  import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
  import { Connection } from "@solana/web3.js";
  import Footer from "../components/Footer.svelte";
  import "../app.css";
  import { games } from "../components/gamelist";
  let nftImages = [];
  let nftAnimationUrls = [];
  let nftNames = [];
  let nftDescriptions = [];
  let wallets;
  let walletConnected = false;
  const localStorageKey = "solWalletAdapter";
  const network = "https://light-autumn-sanctuary.solana-mainnet.discover.quiknode.pro/7779052a9ee594a9e6c09b7d5b28cca360f5685f/";
  // const network = clusterApiUrl('devnet');
  onMount(async () => {
    wallets = [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(),
      new SolflareWalletAdapter(),
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
    }
    $: {
    if (walletConnected) {
      getNFTs();
    }
  }

</script>
<body>
  <main>
    <slot />
    {#if !$walletStore$?.connected}
    <div class="arcade-image justify-center animate-bounce">
      <img src="/arcade.jpg" alt="" />
      </div>
      <div class="arcade-intro justify-center">
        <div class="wallet-before">
          <h1>minion arcade</h1>
          <div class="arcade-button justify-center">
            <WalletProvider {localStorageKey} {wallets} autoConnect />
            <ConnectionProvider {network} />
            <WalletMultiButton>
              <h2> connect</h2>
            </WalletMultiButton>
          </div>
          <h2> select to enter the arcade.</h2>
        </div>
      </div>
    {/if}
    {#if $walletStore$?.connected && !selectedAnimation && nftAnimationUrls.length == 0}
    <div class="arcade-image justify-center animate-bounce">
      <img src="/arcade.jpg" alt="" />
      </div>
    <div class="arcade-intro loading">
      <h1 class="intro-title">minion arcade</h1>
      <div class="progress">
        <div class="color"></div>
      </div>
    </div>
    {/if}
    {#if ($walletStore$.connected && selectedAnimation) || nftAnimationUrls.length > 0}
      <h1 class="after">minion arcade</h1>
    {/if}
    {#if $walletStore$.connected && selectedAnimation}
      <div class="iframe-container">
        <iframe src={selectedAnimation} title="" loading allowfullscreen=true />
        <div class="iframe-text">
          <span class="relative left-3 top-3 flex h-3 w-3">
            <span class="animate-ping absolute left-3 top-3 inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span class="relative left-3 top-3 inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
          <div class="title-header"> 
          <h3>{nftNames[nftAnimationUrls.indexOf(selectedAnimation)]} </h3>
          </div>
          <div class="description-header">
          <h6>
            {nftDescriptions[nftAnimationUrls.indexOf(selectedAnimation)]}
          </h6>
          </div>
        </div>
      </div>
    {/if}
    {#if $walletStore$.connected && nftAnimationUrls.length > 0}
      <h4>Select a game</h4>
      <div class="card-grid justify-center grid grid-rows-3 grid-flow-row gap-0 drop-shadow-2xl">
        {#each nftImages as nftImage, i}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="drop-shadow-2xl card"
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
  @import url("https://use.typekit.net/ykf5ouy.css");
  @import url("https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@1,700&family=Gajraj+One&family=Rubik+Mono+One&family=Shantell+Sans:ital,wght@1,700&display=swap");
  .progress{
    position: relative;
    height: 10px;
    width: 90%;
    border: 10px solid #ff796f;
    border-radius: 15px;
    align-self: center;
    left: 3%;
    margin-bottom: 5%;
}
.title-header { 
  height: 100%;
  border: 3px white dotted;
  border-radius: 10px;
}
.description-header {
  height: 100%;
  border: 3px white dotted;
  border-radius: 10px;
  margin-top: 1%;
  
}
.progress .color{
    position: absolute;
    background-color: #ffffff;
    width: 0px;
    height: 10px;
    border-radius: 15px;
    animation: progres 12s infinite linear;    
}
@keyframes progres {
    0%{
      width: 0%;
    }
    25%{
        width: 50%;
    }
    50%{
        width: 75%;
    }
    75%{
        width: 85%;
    }
    100%{
        width: 100%;
    }
  }
  img {
    width: 200px;
    display: flex;
    margin-bottom: 0%;
  }
  .arcade-image {
    width: 100%;
    display: flex;
    position: relative;
    margin: auto;
    margin-top: 5%;
    margin-bottom: 0%;
  }
  .arcade-button {
    margin: auto;
    display: flex;
    z-index: 1000;
  }
  .after {
    margin-top: 0%;
  }
  .arcade-intro {
    border: 5px white solid;
    width: 50%;
    margin: auto;
    align-items: center;
    margin-top: 0%;
    position: relative;
    bottom: 5%;
    border-radius: 25px;
    box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);
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
    margin: auto;
    margin-bottom: 30px;
    border: 4px white solid;
    max-width: 600px;
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
    height: 1000px;
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
    height: 900px;
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
    text-align: center;
    font-family: unibody-8-new, sans-serif;
    font-weight: 700;
    font-style: normal;
    color: white;
    position: relative;
    font-size: 2rem;
    margin-top: 0%;
    margin-bottom: 2%;
    text-shadow:0 5px 0 #3B3B3B;
    margin: auto;
  }
  h6 {
    text-align: center;
    font-family: unibody-8-new, sans-serif;
    font-weight: 400;
    font-style: italic;
    color: white;
    font-size: 1rem;
    margin-top: 0%;
    text-shadow:0 5px 0 #3B3B3B;
    width: 100%;
    margin-right: 20px;
    margin-bottom: 2%;
    margin-top: 2%;
    font-style: italic;
  }
  h4 {
    margin-top: 0%;
    font-family: unibody-8-new, sans-serif;
    font-weight: 400;
    font-style: italic;
    font-size: 1.5rem;
    text-shadow:0 5px 0 #3B3B3B;
    text-align: center;
    margin-bottom: 2%;
    color: white;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  h2 {
    font-family: unibody-8-new, sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 1.5rem;
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
    font-family: "unibody-8-new", sans-serif;
    font-weight: 900;
    font-style: normal;
    font-size: 3rem;
    text-align: center;
    text-shadow:0 5px 0 #3B3B3B;
    color: white;
    margin-bottom: 1%;
    min-width: 100%;
    margin-top: 0%;
  }
  .loading {
      position: relative;
      bottom: 5%;
    }
  @media (max-width: 760px) {
    .wallet-before {
      position: relative;
      top: 0%;
    }
    .iframe-container{
      height: 1050px;
    }
    iframe {
      height: 1050px;
    }
    h1 {
      font-size: 3rem;
    }
    .arcade-intro {
      width: 85%;
      margin-top: 4%;
    }
    .loading {
      position: relative;
      bottom: 5%;
    }
    .arcade-image {
      margin-top: 20%;
    }
  }
</style>
