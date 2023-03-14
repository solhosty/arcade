<template>
    <div class="iframe-container">
      <iframe src={src} frameborder="0" title=""></iframe>
    </div>
  </template>
  
  <script>
// @ts-nocheck

    export let src;
  </script>
  
  <style>
    .iframe-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      height: 80%;
    }
  
    iframe {
      width: 100%;
      height: 100%;
    }
  </style>