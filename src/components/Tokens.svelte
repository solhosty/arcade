<!-- Tokens.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { Connection, PublicKey } from '@solana/web3.js';
  
    const connection = new Connection("https://light-autumn-sanctuary.solana-mainnet.discover.quiknode.pro/7779052a9ee594a9e6c09b7d5b28cca360f5685f/");
  
    const tokens: any[] = [];
  
    const collectionPublicKey = new PublicKey("7hMhjZunBPPmunwM9DZyc27XiAM4FFJgUarDXv1C3N8n");
  
    async function fetchTokens() {
      const tokenAccounts = await connection.getTokenAccountsByOwner(collectionPublicKey, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") });
      for (const account of tokenAccounts.value) {
        const token = await connection.getParsedAccountInfo(new PublicKey(account.pubkey));
        tokens.push(token.value?.data);
      }
    }
  
    onMount(() => {
      fetchTokens();
    });
  </script>
  
  {#if tokens.length > 0}
    <div class="grid">
      {#each tokens as token}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="card" on:click={() => {window.frames[0].location.href = token?.animation_url;}}>
          <h2>{token?.name}</h2>
          <p>{token?.symbol}</p>
        </div>
      {/each}
    </div>
  {:else}
    <p>Loading tokens...</p>
  {/if}
  