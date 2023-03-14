<!-- SelectedCard.svelte -->
<template>
    {#if selectedCard}
      <div class="selected-card">
        <h2 class="name">{selectedCard.name}</h2>
        <iframe src={selectedCard.animation_url} title=""/>
      </div>
    {:else}
      <p class="message">Select a card to start playing</p>
    {/if}
  </template>
  
  <script>
// @ts-nocheck

    let selectedCard;
  
    function selectCard(token) {
      selectedCard = token;
    }
  </script>
  
  <style>
    .selected-card {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .name {
      font-size: 24px;
      margin-bottom: 10px;
      text-align: center;
    }
  
    iframe {
      width: 100%;
      height: 400px;
    }
  
    .message {
      font-size: 18px;
      margin-top: 20px;
    }
  </style>
  