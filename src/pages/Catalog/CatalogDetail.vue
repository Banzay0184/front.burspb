<script setup lang="ts">
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';
import Product from './components/Product.vue';
import Cards from '../../components/Cards.vue';
import { ref } from 'vue';

const cardsList = ref([
{
    id: 1,
    title: 'Труба колонковая 73х5х2000 ст. 45',
    link: '/catalog/product-truba-kolonkovaya-73x5x2500-st-45',
    image: '/image/cbcd38.webp',
    alt: 'Описание для 974a5faeea33a47198b31602571020',
    available: true,
    articul: '00887',
    oldPrice: '',
    currentPrice: '5 700 ₽',
    showOldPrice: false
  },
  {
    id: 2,
    title: 'Долото III шарошечное 151 С-ЦВ З-88н',
    link: '/catalog/product-doloto-iii-sharoshechnoe-151-s-cv-z-88n',
    image: '/image/9b41b6.webp',
    alt: 'Описание для koronka1',
    available: true,
    articul: '00306',
    oldPrice: '',
    currentPrice: '29 000 ₽',
    showOldPrice: false
  },
  {
    id: 3,
    title: 'Гидроклапан предохранительный МКПВ 32/…',
    link: '/catalog/product-gidroklapan-predoxranitelnyj-mkpv-32-3s2r3',
    image: '/image/1eeb7b.webp',
    alt: 'Описание для CR6_3494',
    available: true,
    articul: '000143',
    oldPrice: '',
    currentPrice: '10 000 ₽',
    showOldPrice: false
  },
  {
    id: 4,
    title: 'Коронка СМ-5 132 мм.',
    link: '/catalog/product-koronka-sm-5-132-mm',
    image: '/image/facfe5.webp',
    alt: 'Описание для Заголовок для: 1230',
    available: true,
    articul: '00473',
    oldPrice: '',
    currentPrice: '1 270 ₽',
    showOldPrice: false
  }
])

const cardsListAdditional = ref([
  {
    id: 1,
    title: 'Труба колонковая 73х5х2000 ст. 45',
    link: '/catalog/product-truba-kolonkovaya-73x5x2500-st-45',
    image: '/image/cbcd38.webp',
    alt: 'Описание для 974a5faeea33a47198b31602571020',
    available: true,
    articul: '00887',
    oldPrice: '',
    currentPrice: '5 700 ₽',
    showOldPrice: false
  },
  {
    id: 2,
    title: 'Долото III шарошечное 151 С-ЦВ З-88н',
    link: '/catalog/product-doloto-iii-sharoshechnoe-151-s-cv-z-88n',
    image: '/image/9b41b6.webp',
    alt: 'Описание для koronka1',
    available: true,
    articul: '00306',
    oldPrice: '',
    currentPrice: '29 000 ₽',
    showOldPrice: false
  },
  {
    id: 3,
    title: 'Гидроклапан предохранительный МКПВ 32/…',
    link: '/catalog/product-gidroklapan-predoxranitelnyj-mkpv-32-3s2r3',
    image: '/image/1eeb7b.webp',
    alt: 'Описание для CR6_3494',
    available: true,
    articul: '000143',
    oldPrice: '',
    currentPrice: '10 000 ₽',
    showOldPrice: false
  },
  {
    id: 4,
    title: 'Коронка СМ-5 132 мм.',
    link: '/catalog/product-koronka-sm-5-132-mm',
    image: '/image/facfe5.webp',
    alt: 'Описание для Заголовок для: 1230',
    available: true,
    articul: '00473',
    oldPrice: '',
    currentPrice: '1 270 ₽',
    showOldPrice: false
  }
]);

const addToCart = (id: number) => {
  console.log('Добавлено в корзину:', id)
  // Логика добавления в корзину
}
</script>

<template>
<main class="main">
    
    <Breadcrumbs />

    <Product />

    <section class="section selected-products selected-products--inside-product">
        <div class="section-title"><h3 class="section-title-tag">С этим продуктом покупают</h3></div>
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

    <Gratitude />
</main>
</template>