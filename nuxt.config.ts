export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  css: ['~/assets/css/main.css'],
  runtimeConfig: { databaseUrl: process.env.DATABASE_URL },
  typescript: { strict: true },
})
