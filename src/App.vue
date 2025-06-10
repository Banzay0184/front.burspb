<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import NavigationQuick from './components/NavigationQuick.vue';
import apiService from './api/api';
import { RouterView } from 'vue-router';
import CookieBanner from './components/CookieBanner.vue';
import MetaManager from './components/MetaManager.vue';
import GlobalSeoChecker from './components/GlobalSeoChecker.vue';
import SeoManager from './components/SeoManager.vue';
import { useNotifications } from './composables/useNotifications';

const favicon = ref('/favicon.ico'); // Значение по умолчанию

// Инициализация глобальной системы уведомлений
const { showNotification, notificationMessage } = useNotifications();

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    if (response.data && response.data.favicon) {
      updateFavicon(response.data.favicon);
    }
  } catch (error) {
    // Игнорируем ошибки API в SSR
  }
};

const updateFavicon = (faviconUrl: string | null) => {
  if (!faviconUrl || typeof window === 'undefined') return;
  
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

// Выполняем только в браузере
onMounted(() => {
  if (typeof window !== 'undefined') {
  fetchGlobalData();
  }
});
</script>

<template>
  <MetaManager />
  <GlobalSeoChecker />
  <SeoManager />
  <v-app>
    <div id="layout">
      <Header />
      <router-view/>
      <Footer />
      <NavigationQuick />
      <CookieBanner />
    </div>
    
    <!-- Глобальные уведомления -->
    <div class="notification" :class="{ 'notification--show': showNotification }">
      <div class="notification__content">
        <div class="notification__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <div class="notification__message">
          {{ notificationMessage }}
        </div>
      </div>
    </div>
  </v-app>
</template>

<style scoped>
/* Стили для уведомления */
.notification {
  position: fixed;
  bottom: -100px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  transition: bottom 0.3s ease-in-out;
  z-index: 1000;
}

.notification--show {
  bottom: 20px;
}

.notification__content {
  background: linear-gradient(223.06deg, #0cf 3.37%, #006079 100.96%);
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  max-width: 80%;
}

.notification__icon {
  margin-right: 15px;
}

.notification__message {
  font-size: 16px;
}
</style>
