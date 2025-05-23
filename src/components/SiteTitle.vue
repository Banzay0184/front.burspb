<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
</script>

<template>
    <div class="site-title" v-html="siteTitle.replace('№1 в России', '<strong>№1 в России</strong>')"></div>
</template>

<style scoped>
</style>