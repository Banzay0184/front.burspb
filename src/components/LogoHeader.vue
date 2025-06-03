<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHead } from '@vueuse/head';
import apiService from '../api/api';

const logoUrl = ref('/image/7dd5a8.svg');
const logoAlt = ref('Оборудование для бурения №1 в России');

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    if (response.data && response.data.logo) {
      logoUrl.value = response.data.logo.default || logoUrl.value;
      logoAlt.value = response.data.siteTitle || logoAlt.value;
    }
  } catch (error) {
  }
};

// Создаем микроразметку для логотипа
const logoSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': logoAlt.value,
  'logo': {
    '@type': 'ImageObject',
    'url': logoUrl.value,
    'width': '290',
    'height': '92',
    'caption': logoAlt.value
  },
  'url': '/',
  'sameAs': [
    'https://t.me/bur_spb',
    'https://api.whatsapp.com/send?phone=79213162621'
  ]
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(logoSchema.value)
    }
  ]
});

onMounted(() => {
  fetchGlobalData();
});
</script>

<template>
    <div class="logo">
        <RouterLink to="/" aria-current="page" class="nuxt-link-exact-active nuxt-link-active">
            <img :src="logoUrl" width="290" height="92" :alt="logoAlt" />
        </RouterLink>
    </div>
</template>

<style scoped>
</style>