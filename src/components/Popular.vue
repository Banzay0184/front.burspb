<script setup lang="ts">
import { ref, onMounted } from 'vue';
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

const fetchPopularItems = async () => {
  isLoading.value = true;
  hasError.value = false;
  
  try {
    const response = await apiService.blocks.getPopular();

    if (response.data && Array.isArray(response.data.content)) {
      popularItems.value = response.data.content.map((item: any) => ({
        id: item.id || 0,
        title: item.title || '',
        description: item.description || undefined,
        imageUrl: item.image?.webp_full || item.image?.full || '',
        link: item.url?.slug ? `/catalog/selection-${item.url.slug}` : `/catalog/CatalogPage`
      }));
      
    } else {
      hasError.value = true;
    }
  } catch (error) {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPopularItems();
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