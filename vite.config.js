import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // Fallback to mock response if backend not available
        bypass(req, res, options) {
          if (req.url === '/api/generate-meal-plan' && req.method === 'POST') {
            // Mock response for local development
            const mockPlan = [
              { day: 'Monday', meals: [
                { type: 'Breakfast', name: 'Tapsilog', price: 85, calories: 450, components: 'Tapa - 150g\nRice - 250g\nEgg - 1pc\npotato - 1pc' },
                { type: 'Lunch', name: 'Tinola', price: 120, calories: 320, components: 'Rice - 250g\nTinola - 250g' },
                { type: 'Dinner', name: 'Sinigang na Baboy', price: 150, calories: 380, components: 'Rice - 250g\nSinigang - 350g' }
              ]},
              { day: 'Tuesday', meals: [
                { type: 'Breakfast', name: 'Longsilog', price: 90, calories: 480, components: 'Longanisa - 120g\nRice - 250g\nEgg - 1pc' },
                { type: 'Lunch', name: 'Adobong Manok', price: 115, calories: 350, components: 'Rice - 250g\nAdobong Manok - 300g' },
                { type: 'Dinner', name: 'Kare-Kare', price: 160, calories: 400, components: 'Rice - 250g\nKare-Kare - 350g' }
              ]},
              { day: 'Wednesday', meals: [
                { type: 'Breakfast', name: 'Bangsilog', price: 80, calories: 420, components: 'Bangus - 150g\nRice - 250g\nEgg - 1pc' },
                { type: 'Lunch', name: 'Lumpia', price: 110, calories: 380, components: 'Rice - 250g\nLumpia - 200g' },
                { type: 'Dinner', name: 'Pinakbet', price: 140, calories: 360, components: 'Rice - 250g\nPinakbet - 300g' }
              ]},
              { day: 'Thursday', meals: [
                { type: 'Breakfast', name: 'Tocino Sandwich', price: 75, calories: 390, components: 'Tocino - 100g\nBread - 2 slices\nCheese - 30g' },
                { type: 'Lunch', name: 'Fried Tilapia', price: 125, calories: 340, components: 'Rice - 250g\nTilapia - 250g' },
                { type: 'Dinner', name: 'Bulalo', price: 165, calories: 420, components: 'Rice - 250g\nBulalo - 400g' }
              ]},
              { day: 'Friday', meals: [
                { type: 'Breakfast', name: 'Hotsilog', price: 95, calories: 470, components: 'Hotdog - 100g\nRice - 250g\nEgg - 1pc' },
                { type: 'Lunch', name: 'Lapu-Lapu Fillet', price: 130, calories: 360, components: 'Rice - 250g\nLapu-Lapu - 300g' },
                { type: 'Dinner', name: 'Nilaga', price: 155, calories: 390, components: 'Rice - 250g\nNilaga - 350g' }
              ]},
              { day: 'Saturday', meals: [
                { type: 'Breakfast', name: 'Corned Beef Tapa', price: 88, calories: 460, components: 'Corned Beef - 120g\nRice - 250g\nEgg - 1pc' },
                { type: 'Lunch', name: 'Chicken Caldereta', price: 135, calories: 380, components: 'Rice - 250g\nCaldereta - 350g' },
                { type: 'Dinner', name: 'Lumpiang Shanghai', price: 120, calories: 410, components: 'Rice - 250g\nLumpia Shanghai - 250g' }
              ]},
              { day: 'Sunday', meals: [
                { type: 'Breakfast', name: 'Pandesal with Cheese', price: 50, calories: 280, components: 'Pandesal - 2pcs\nCheese - 50g' },
                { type: 'Lunch', name: 'Lechon Kawali', price: 140, calories: 450, components: 'Rice - 250g\nLechon Kawali - 400g' },
                { type: 'Dinner', name: 'Arroz Caldo', price: 95, calories: 340, components: 'Arroz Caldo - 400g' }
              ]}
            ]
            
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(mockPlan))
            return true
          }
        }
      }
    }
  }
})
