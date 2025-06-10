<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Функция для проверки и установки canonical ссылки по умолчанию
const ensureCanonicalExists = () => {
  setTimeout(() => {
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    
    if (!existingCanonical) {
      console.warn('⚠️ GlobalSeoChecker: Canonical link отсутствует, НО НЕ устанавливаем принудительно (пусть SEO система сама управляет)');
    } else {
      // Canonical link найден
    }
  }, 200); // Даем время другим компонентам установить SEO
};

// Проверяем canonical при монтировании
onMounted(() => {
  ensureCanonicalExists();
});

// Проверяем canonical при изменении маршрута
watch(() => route.fullPath, () => {
  ensureCanonicalExists();
});
</script>

<template>
  <!-- Этот компонент не рендерит ничего в DOM -->
</template> 