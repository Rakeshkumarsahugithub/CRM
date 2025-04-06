import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Customize build configuration
  build: {
    // Define the output directory for your build files
    outDir: 'dist',
    
    // Adjust chunk size warning limit (optional, you can increase this if necessary)
    chunkSizeWarningLimit: 1000, // Default is 500kb, this increases the limit to 1MB
    
    rollupOptions: {
      // Customize manual chunking if you want to split third-party libraries into separate chunks
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Place all node_modules dependencies in a "vendor" chunk
          }
        }
      }
    }
  }
});
