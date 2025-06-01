<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../api/api';

// Используем интерфейс из api.ts для структуры блока Cover

// Состояния для данных
const title = ref('Читайте наши полезные статьи');
const content = ref('<p>Много полезной информации связанной с буровыми установками и инструментом для бурения вы можете найти в нашем разделе "Статьи"</p>');
const imageUrl = ref('/image/123359.webp');
const imageAlt = ref('cover');
const isLoading = ref(false);
const hasError = ref(false);

// Получение данных из API
const fetchCoverData = async () => {
  isLoading.value = true;
  hasError.value = false;
  
  try {
    const response = await apiService.blocks.getCover();
    
    if (response.data) {
      title.value = response.data.title || title.value;
      content.value = response.data.content || content.value;
      
      if (response.data.image) {
        // Используем WebP версию, если браузер поддерживает
        imageUrl.value = response.data.image.webp_full || response.data.image.full || imageUrl.value;
        
        if (response.data.image.alt) {
          imageAlt.value = response.data.image.alt.title || imageAlt.value;
        }
      }
    }
  } catch (error) {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCoverData();
});
</script>

<template>
    <section class="section cover" :class="{ 'is-loading': isLoading, 'has-error': hasError }">
        <div class="cover__image">
            <img :src="imageUrl" width="1366" height="768" :alt="imageAlt" loading="lazy">
        </div>
        <div class="cover__inner">
            <div class="wrapper">
                <h3 class="cover__inner__title">{{ title }}</h3>
                <div class="cover__inner__description" v-html="content">
                </div>
                <div>
                    <span class="button-wrapper">
                        <RouterLink class="button button--blue button--cover" to="/statji" itemprop="url">
                            Подробнее
                        </RouterLink>
                    </span>
                </div>
            </div>
        </div>
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