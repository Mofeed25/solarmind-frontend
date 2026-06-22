// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// تكوين إعدادات Vite لدمج حزمة React وحزمة Tailwind CSS v4
export default defineConfig({
  plugins: [
    react(),        // تفعيل دعم ملفات الـ React (JSX)
    tailwindcss(),  // تفعيل محرك Tailwind لمعالجة ألوان وتنسيقات قطاع الطاقة الشمسية
  ],
})