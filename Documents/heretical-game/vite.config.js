import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Build configuration
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      mangle: {
        reserved: ['HereticalGame', 'GameEngine'] // Keep important names
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index-modular.html'),
        app: resolve(__dirname, 'src/js/app.js')
      },
      output: {
        manualChunks: {
          // Code splitting for better performance
          'game-core': [
            'src/js/modules/game-engine.js',
            'src/js/modules/state-manager.js',
            'src/js/modules/event-emitter.js'
          ],
          'game-ui': [
            'src/js/modules/dom-manager.js',
            'src/js/templates/html-templates.js'
          ],
          'game-data': [
            'src/js/modules/question-manager.js',
            'src/js/modules/council-manager.js',
            'src/js/modules/verdict-calculator.js'
          ],
          'game-utilities': [
            'src/js/modules/error-handler.js',
            'src/js/modules/performance-monitor.js',
            'src/js/modules/module-loader.js'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000 // KB - Allow larger chunks for game assets
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    cors: true,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block'
    }
  },

  // Preview server
  preview: {
    port: 4173,
    open: true
  },

  // CSS and assets
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/css/main.css";`
      }
    }
  },

  // Asset handling
  assetsInclude: [
    '**/*.json',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.woff',
    '**/*.woff2',
    '**/*.ttf',
    '**/*.eot'
  ],

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __NODE_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
  },

  // Resolve aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@modules': resolve(__dirname, 'src/js/modules'),
      '@templates': resolve(__dirname, 'src/js/templates'),
      '@data': resolve(__dirname, 'src/data'),
      '@css': resolve(__dirname, 'src/css'),
      '@tests': resolve(__dirname, 'tests')
    }
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [],
    exclude: [] // All dependencies are included in the bundle
  },

  // Worker configuration
  worker: {
    format: 'es'
  },

  // Progressive Web App support
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
    },
    manifest: {
      name: 'The Heretical Game',
      short_name: 'HereticalGame',
      description: 'A medieval theological quiz game',
      theme_color: '#8B4513',
      background_color: '#F4E8D0',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },

  // Performance monitoring
  esbuild: {
    target: 'es2020',
    format: 'esm',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
    splitting: true,
    chunkNames: 'chunk-[name]-[hash]'
  }
});