import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { sveltekit } from '@sveltejs/kit/vite';
import inject from '@rollup/plugin-inject';

// Config is based on metaplex + vite example from:
// https://github.com/metaplex-foundation/js-examples/tree/main/getting-started-vite

// es2020 Needed for BigNumbers
// See https://github.com/sveltejs/kit/issues/859

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      process: "/process/browser",
      buffer: "buffer",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      http: "stream-http",
      https: "https-browserify",
      url: "url",
      util: "util",
      zlib: "browserify-zlib",
      
  },
},
build : {
  target: "es2020",
  rollupOptions : {
      plugins : [
          // Important for wallet adapter to work.
          inject({ Buffer: ['buffer', 'Buffer'] })
      ]
  }
},
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
      target: "es2020",
    },
  },
});