// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base:'/',
//   server: {
//     proxy: {
//       '/api': 'http://localhost:3001', // Adjust the port to match your server
//     },
//   },
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    outDir: 'dist', // Default build directory; copying to 'dest' with postbuild script
  },
});
