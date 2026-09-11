import { defineConfig } from 'vite';
import { availabilityPlugin } from './server/availability.mjs';
export default defineConfig({plugins:[availabilityPlugin()],base:'./',cacheDir:'.vite-cache',server:{host:'127.0.0.1',port:4173,strictPort:true,watch:{ignored:['**/*.glb','**/evidence/**']}},build:{chunkSizeWarningLimit:900}});
