import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // console.log(env);
  
  return {
    base: mode === 'development' ? '/' : '/',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      open: true,
      port: 3000,
      host:'0.0.0.0',
      proxy: {
        // '/api': {
        //            target: 'http://3.12.20.117:3004',
        //            changeOrigin: true,
        //            rewrite: (path) => path.replace(/^\/api/, '')
        //        }
      },
    },
     
  }
})
