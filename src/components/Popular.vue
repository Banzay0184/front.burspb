<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHead } from '@vueuse/head';
import { RouterLink } from 'vue-router';
import apiService from '../api/api';

interface PopularItem {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  link: string;
}

const popularItems = ref<PopularItem[]>([]);
const isLoading = ref(true);
const hasError = ref(false);

const getInitialData = () => {
  if (typeof window !== 'undefined' && (window as any).__INITIAL_STATE__) {
    try {
      let initialState = (window as any).__INITIAL_STATE__;
      if (typeof initialState === 'string') {
        initialState = JSON.parse(initialState);
      }
      return initialState.popularBlocks || [];
      } catch (err) {
    // Тихо обрабатываем ошибку парсинга
    return [];
  }
  }
  return [];
};

const fetchPopularItems = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    const response = await apiService.blocks.getPopular();
    const popularData = response.data.content || [];

    // Преобразуем API данные в PopularItem формат
    popularItems.value = popularData.map((item: any) => ({
        id: item.id || 0,
        title: item.title || '',
        description: item.description || undefined,
        imageUrl: item.image?.webp_full || item.image?.full || '',
        link: item.url?.slug ? `/catalog/selection-${item.url.slug}` : '/catalog'
      }));
  } catch (error) {
    hasError.value = true;
    popularItems.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Создаем микроразметку для популярных разделов
const popularSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Популярные разделы каталога',
  description: 'Самые популярные разделы каталога бурового оборудования',
  itemListElement: popularItems.value.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CategoryCode',
      name: item.title,
      description: item.description,
      image: item.imageUrl,
      url: `https://burspb.ru${item.link}`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://burspb.ru${item.link}`
      }
    }
  }))
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(popularSchema.value)
    }
  ]
});

onMounted(() => {
  // Проверяем есть ли предварительно загруженные данные SSG
  const ssgData = getInitialData();
  
  if (ssgData && Array.isArray(ssgData) && ssgData.length > 0) {
    // Преобразуем SSG данные в PopularItem формат
    popularItems.value = ssgData.map((item: any) => ({
      id: item.id || 0,
      title: item.title || '',
      description: item.description || undefined,
      imageUrl: item.image?.webp_full || item.image?.full || '',
      link: item.url?.slug ? `/catalog/selection-${item.url.slug}` : '/catalog'
    }));
    
    isLoading.value = false;
    hasError.value = false;
  } else {
  if (typeof window !== 'undefined') {
  fetchPopularItems();
    }
  }
});
</script>

<template>
  <section v-if="!isLoading && !hasError && popularItems.length >= 6" class="section popular">
    <div class="section-title">
      <h3 class="section-title-tag">Популярные разделы каталога</h3>
    </div>
    <div class="popular-inner">
      <div class="popular-main">
        <div 
          class="popular__item popular__item--1" 
          :style="`background-image: url('${popularItems[0].imageUrl}')`"
        >
          <div class="popular__item__content">
            <h3 class="popular__item__content__title">{{ popularItems[0].title }}</h3>
            <p 
              v-if="popularItems[0].description" 
              class="popular__item__content__description"
            >
              {{ popularItems[0].description }}
            </p>
            <div>
              <span class="button-wrapper">
                <RouterLink
                  :to="popularItems[0].link" 
                  class="button button--blue button--popular"
                  itemprop="url"
                >
                  Подробнее
                </RouterLink>
              </span>
            </div>
          </div>
        </div>
        <div class="popular-main__bottom">
          <div 
            class="popular__item popular__item--2" 
            :style="`background-image: url('${popularItems[1].imageUrl}')`"
          >
            <div class="popular__item__content">
              <h3 class="popular__item__content__title">{{ popularItems[1].title }}</h3>
              <div>
                <span class="button-wrapper">
                  <RouterLink 
                    :to="popularItems[1].link" 
                    class="button button--blue button--popular"
                    itemprop="url"
                  >
                    Подробнее
                  </RouterLink>
                </span>
              </div>
            </div>
          </div>
          <div 
            class="popular__item popular__item--3" 
            :style="`background-image: url('${popularItems[2].imageUrl}')`"
          >
            <div class="popular__item__content">
              <h3 class="popular__item__content__title">{{ popularItems[2].title }}</h3>
              <div>
                <span class="button-wrapper">
                  <RouterLink 
                    :to="popularItems[2].link" 
                    class="button button--blue button--popular"
                    itemprop="url"
                  >
                    Подробнее
                  </RouterLink>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="popular-side">
        <div 
          class="popular__item popular__item--4" 
          :style="`background-image: url('${popularItems[3].imageUrl}')`"
        >
          <div class="popular__item__content">
            <h3 class="popular__item__content__title">{{ popularItems[3].title }}</h3>
            <div>
              <span class="button-wrapper">
                <RouterLink 
                  :to="popularItems[3].link" 
                  class="button button--blue button--popular"
                  itemprop="url"
                >
                  Подробнее
                </RouterLink>
              </span>
            </div>
          </div>
        </div>
        <div 
          class="popular__item popular__item--5" 
          :style="`background-image: url('${popularItems[4].imageUrl}')`"
        >
          <div class="popular__item__content">
            <h3 class="popular__item__content__title">{{ popularItems[4].title }}</h3>
            <div>
              <span class="button-wrapper">
                <RouterLink 
                  :to="popularItems[4].link" 
                  class="button button--blue button--popular"
                  itemprop="url"
                >
                  Подробнее
                </RouterLink>
              </span>
            </div>
          </div>
        </div>
        <div 
          class="popular__item popular__item--6" 
          :style="`background-image: url('${popularItems[5].imageUrl}')`"
        >
          <div class="popular__item__content">
            <h3 class="popular__item__content__title">{{ popularItems[5].title }}</h3>
            <div>
              <span class="button-wrapper">
                <RouterLink 
                  :to="popularItems[5].link" 
                  class="button button--blue button--popular"
                  itemprop="url"
                >
                  Подробнее
                </RouterLink>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
/* Стили остаются без изменений */
</style>