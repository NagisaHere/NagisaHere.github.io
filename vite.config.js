import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
  
  server: {
    open: '/experiment.html'
  },
    build: {
    rollupOptions: {
      input: {
        // 'main' is just an internal name for the chunk. 
        // Replace 'experiment.html' with your actual file name.
        main: resolve(__dirname, 'experiment.html')
      }
    }
  } 
});