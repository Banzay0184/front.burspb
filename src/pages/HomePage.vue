<script setup lang="ts">
import Benefits from '../components/Benefits.vue';
import Cover from '../components/Cover.vue';
import Gratitude from '../components/Gratitude.vue';
import Oes from '../components/Oes.vue';
import Partnership from '../components/Partnership.vue';
import Popular from '../components/Popular.vue';
import RecentPosts from '../components/RecentPosts.vue';
import Cards from '../components/Cards.vue';
import { ref } from 'vue'

const cardsList = ref([
{
    id: 1,
    title: 'Сетка галунного плетения П-56 фильтров…',
    link: '/catalog/Card-setka-filtrovaya-galunnogo-pleteniya-p-56',
    image: '/image/68ab2f.webp',
    alt: 'Описание для Сетка',
    available: true,
    articul: '00937',
    oldPrice: '1 470 ₽',
    currentPrice: '1 250 ₽'
  },
  {
    id: 2,
    title: 'Сетка галунного плетения П-64 фильтров…',
    link: '/catalog/Card-setka-filtrovaya-galunnogo-pleteniya-p-64',
    image: '/image/68ab2f.webp',
    alt: 'Описание для Сетка',
    available: true,
    articul: '00938',
    oldPrice: '1 470 ₽',
    currentPrice: '1 250 ₽'
  },
  {
    id: 3,
    title: 'Фильтр готовый НПВХ 125х5,0х3000 (0,3…',
    link: '/catalog/Card-filtr-gotovyj-npvx-125x50x3000-03-shhelevoj',
    image: '/image/88c6e6.webp',
    alt: 'Описание для fb37d4fa6442e41b0084f8f98bb8fbd1',
    available: true,
    articul: '00925',
    oldPrice: '3 700 ₽',
    currentPrice: '3 300 ₽'
  },
  {
    id: 4,
    title: 'Фильтр готовый НПВХ 90х5,0х3000 (0,3)…',
    link: '/catalog/Card-filtr-gotovyj-npvx-90x50x3000-03-shhelevoj',
    image: '/image/88c6e6.webp',
    alt: 'Описание для fb37d4fa6442e41b0084f8f98bb8fbd1',
    available: true,
    articul: '00926',
    oldPrice: '3 000 ₽',
    currentPrice: '2 700 ₽'
  }
])

const cardsListAdditional = ref([
{
    id: 3,
    title: 'Фильтр готовый НПВХ 125х5,0х3000 (0,3…',
    link: '/catalog/Card-filtr-gotovyj-npvx-125x50x3000-03-shhelevoj',
    image: '/image/88c6e6.webp',
    alt: 'Описание для fb37d4fa6442e41b0084f8f98bb8fbd1',
    available: true,
    articul: '00925',
    oldPrice: '3 700 ₽',
    currentPrice: '3 300 ₽'
  },
  {
    id: 4,
    title: 'Фильтр готовый НПВХ 90х5,0х3000 (0,3)…',
    link: '/catalog/Card-filtr-gotovyj-npvx-90x50x3000-03-shhelevoj',
    image: '/image/88c6e6.webp',
    alt: 'Описание для fb37d4fa6442e41b0084f8f98bb8fbd1',
    available: true,
    articul: '00926',
    oldPrice: '3 000 ₽',
    currentPrice: '2 700 ₽'
  }
])

const addToCart = (id: number) => {
  console.log('Добавлено в корзину:', id)
  // Логика добавления в корзину
}
</script>


<template>
<main class="main main--index">
    <div class="fullwidth fullwidth--benefits">
        <div class="wrapper">
            <Benefits />
        </div>
    </div>
    <div class="wrapper">
        <Popular />
    </div>
    <div class="wrapper">
        <section class="section selected-products">
          <div>
            <div>
              <Cards
                :initial-cards="cardsList" 
                :additional-cards="cardsListAdditional"
                :load-more="true"
                @add-to-cart="addToCart"
              />
            </div>
          </div>
        </section>
    </div>
    <div class="wrapper">
        <Partnership />
    </div>
    <div class="wrapper">
        <Gratitude />
    </div>
    <div class="fullwidth fullwidth--cover">
        <Cover />
    </div>
    <div class="wrapper">
        <RecentPosts />
    </div>
    <div class="wrapper">
        <Oes />
    </div>
</main>
</template>