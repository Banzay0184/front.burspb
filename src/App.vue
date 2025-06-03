<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import NavigationQuick from './components/NavigationQuick.vue';
import apiService from './api/api';
import { RouterView } from 'vue-router';
import CookieBanner from './components/CookieBanner.vue';
import MetaTagsManager from './components/MetaTagsManager.vue';
import MetaManager from './components/MetaManager.vue';

const favicon = ref('/favicon.ico'); // Значение по умолчанию

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    if (response.data && response.data.favicon) {
      updateFavicon(response.data.favicon);
    }
  } catch (error) {
  }
};

const updateFavicon = (faviconUrl: string | null) => {
  if (!faviconUrl) return;
  
  favicon.value = faviconUrl;
  
  // Обновляем фавиконку в DOM
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = faviconUrl;
};

onMounted(() => {
  fetchGlobalData();
});
</script>

<template>
  <MetaManager />
  <MetaTagsManager />
  <v-app>
    <div id="layout">
      <Header />
      <router-view/>
      <Footer />
      <NavigationQuick />
      <CookieBanner />
    </div>
  </v-app>
</template>

<style scoped>
</style>
