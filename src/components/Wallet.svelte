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

</style>