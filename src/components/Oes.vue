<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../api/api';

// Состояния для данных
const title = ref('Буровые установки, оборудование и инструмент');
const content = ref('');
const isLoading = ref(false);
const hasError = ref(false);

const fetchSeoData = async () => {
  isLoading.value = true;
  hasError.value = false;
  
  try {
    const response = await apiService.blocks.getSeo();
    
    if (response.data) {
      title.value = response.data.title || title.value;
      // Используем контент из API для отображения в блоке
      content.value = response.data.content || content.value;
    }
  } catch (error) {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchSeoData();
});
</script>

<template>
    <section class="section oes" :class="{ 'is-loading': isLoading, 'has-error': hasError }">
        <div class="section-title"><h1 class="section-title-tag">{{ title }}</h1></div>
        <div class="content" v-html="content"></div>
    </section>
</template>

<style scoped>
.is-loading {
  opacity: 0.7;
}
.has-error {
  outline: 1px solid red;
}
</style>