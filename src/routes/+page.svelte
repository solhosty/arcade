<script>
  // @ts-nocheck

  import Wallet from "../components/Wallet.svelte";
  import { walletStore as walletStore$ } from "@svelte-on-solana/wallet-adapter-core";

</script>

<h1>minion arcade</h1>
{#if !$walletStore$?.connected}
  <div class="wallet-before">
    <Wallet />
    <h2>connect wallet to enter the arcade.</h2>
  </div>
{/if}

<style>
  @import url("https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@1,700&family=Gajraj+One&family=Rubik+Mono+One&family=Shantell+Sans:ital,wght@1,700&display=swap");
  .wallet-before {
    position: relative;
    top: 20%;
  }
  h1 {
    font-family: "Gajraj One", cursive;
    font-size: 3rem;
    text-align: center;
    color: white;
    margin-bottom: 0%;
    min-width: 100%;
    margin-top: 0%;
  }
  h2 {
    font-family: "Exo 2", sans-serif;
    font-size: 2rem;
    text-align: center;
    margin-top: 0%;
    color: white;
  }
  

  @media (max-width: 760px) {
    h1 {
      font-size: 2.9rem;
      width: 100%;
    }
  }
  
</style>
