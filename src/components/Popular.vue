<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface PopularItem {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  link: string;
}

const popularItems: PopularItem[] = [
  {
    id: 1,
    title: "Оборудование и инструмент для бурения скважин",
    description: "Самый нужный инструмент используемый для бурения скважин. Большой ассортимент различного бурового оборудования",
    imageUrl: "https://burspb.com/api/files/popular-01.jpg.webp",
    link: "/catalog/category-dlya-bureniya-skvazhin-na-vodu"
  },
  {
    id: 2,
    title: "Инструмент для шнекового бурения",
    imageUrl: "https://burspb.com/api/files/popular-02.jpg.webp",
    link: "/catalog/category-shnekovoe-burenie"
  },
  {
    id: 3,
    title: "Вспомогательный инструмент",
    imageUrl: "https://burspb.com/api/files/popular-03.jpg.webp",
    link: "/catalog/category-vspomogatelnyj-instrument"
  },
  {
    id: 4,
    title: "PDC долота",
    imageUrl: "https://burspb.com/api/files/popular-04.jpg.webp",
    link: "/catalog/category-pdc-doloto"
  },
  {
    id: 5,
    title: "Аварийный инструмент",
    imageUrl: "https://burspb.com/api/files/popular-05.jpg.webp",
    link: "/catalog/category-avarijnyj-instrument"
  },
  {
    id: 6,
    title: "Обустройство скважин",
    imageUrl: "https://burspb.com/api/files/popular-06.jpg.webp",
    link: "/catalog/category-obustrojstvo-skvazhin"
  }
];
</script>

<template>
  <section class="section popular">
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


<style scoped>
</style>