<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHead } from '@vueuse/head';
import apiService from '../api/api';

const siteTitle = ref('Оборудование для бурения №1 в России');

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    if (response.data && response.data.siteTitle) {
      siteTitle.value = response.data.siteTitle;
    }
  } catch (error) {
  }
};

onMounted(() => {
  fetchGlobalData();
});

// Создаем микроразметку для названия сайта
const siteTitleSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteTitle.value,
  url: 'https://burspb.ru',
  description: 'БурСПб - ведущий поставщик бурового оборудования в России',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://burspb.ru/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(siteTitleSchema.value)
    }
  ]
});
</script>

<template>
    <div class="site-title" v-html="siteTitle.replace('№1 в России', '<strong>№1 в России</strong>')"></div>
</template>

<style scoped>
</style>