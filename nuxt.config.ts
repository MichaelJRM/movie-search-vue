// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'http://www.omdbapi.com/',
      apiKey: 'e22ec189',
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
  ]
})
