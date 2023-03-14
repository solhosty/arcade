<!-- Wallet.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import {WalletMultiButton } from '@svelte-on-solana/wallet-adapter-ui';
    import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
    import { Connection, clusterApiUrl } from "@solana/web3.js";
    import { PublicKey } from '@solana/web3.js';
  </script>
 
<div class="wallet">
<WalletMultiButton>
    Connect
</WalletMultiButton>
</div>
    

<style>
    @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@1,700&family=Gajraj+One&family=Rubik+Mono+One&family=Shantell+Sans:ital,wght@1,700&display=swap');
  
   .wallet {
    margin: auto;
    display: flex;
    justify-content: center;
    margin-bottom: 3%;
    z-index: 1000;
   }

    /*
    .shop-button {
        transition: 0.2 ease-out all;
        background-color: rgba(0, 0, 0, .2);
    }
    .shop-button:hover {
        transform: translateY(-4.1px);
    }
    img {
        width: 50%;
        height: 50%;
        margin: auto;
    }
    */
 
    
    p {
    font-family: 'Exo 2', sans-serif;
    font-size: 1rem;
    text-align: center;
    margin: auto;
    margin-bottom: 3%;
    color: white;
    }
</style>