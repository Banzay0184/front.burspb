<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
    console.error('Ошибка при получении данных логотипа:', error);
  }
};

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