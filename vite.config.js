import { defineConfig } from 'vite';
export default defineConfig({base:'./',cacheDir:'.vite-cache',server:{host:'127.0.0.1',port:4173,strictPort:true,watch:{ignored:['**/*.glb','**/evidence/**']}},build:{chunkSizeWarningLimit:900}});
