<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Benefits from '../components/Benefits.vue';
import Cover from '../components/Cover.vue';
import Gratitude from '../components/Gratitude.vue';
import Oes from '../components/Oes.vue';
import Partnership from '../components/Partnership.vue';
import Popular from '../components/Popular.vue';
import RecentPosts from '../components/RecentPosts.vue';
import Cards from '../components/Cards.vue';

// Состояние компонента для карточек товаров
const cardsList = ref<any[]>([]);
const cardsListAdditional = ref<any[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Функция для запроса популярных продуктов с API
const fetchPopularProducts = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Запрашиваем продукты, сортируя по популярности (количеству просмотров)
    const params = new URLSearchParams({
      sort: 'popularity-desc', // Сортировка по популярности (от большего к меньшему)
      per_page: '8'  // Получаем первые 8 популярных продуктов
    });
    
    const response = await fetch(`https://burspb.com/api/data/v1/products/?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Преобразуем первые 4 продукта для основного отображения
    if (data.posts && data.posts.length > 0) {
      cardsList.value = data.posts.slice(0, 4).map((product: any) => ({
        id: product.id,
        title: product.title.length > 40 ? `${product.title.substring(0, 40)}…` : product.title,
        link: `/catalog/product-${product.slug}`,
        image: product.img.webp_square_350 || product.img.square_350 || '',
        alt: product.img.alt?.description || product.title,
        available: product.meta.availability,
        articul: product.meta.artikul || '',
        oldPrice: product.meta.price_old ? `${product.meta.price_old} ₽` : '',
        currentPrice: `${product.meta.price} ₽`,
        showOldPrice: !!product.meta.price_old
      }));
      
      // Если есть еще продукты, добавляем их в дополнительные для "Загрузить еще"
      if (data.posts.length > 4) {
        cardsListAdditional.value = data.posts.slice(4).map((product: any) => ({
          id: product.id,
          title: product.title.length > 40 ? `${product.title.substring(0, 40)}…` : product.title,
          link: `/catalog/product-${product.slug}`,
          image: product.img.webp_square_350 || product.img.square_350 || '',
          alt: product.img.alt?.description || product.title,
          available: product.meta.availability,
          articul: product.meta.artikul || '',
          oldPrice: product.meta.price_old ? `${product.meta.price_old} ₽` : '',
          currentPrice: `${product.meta.price} ₽`,
          showOldPrice: !!product.meta.price_old
        }));
      }
    }
    
  } catch (err) {
    console.error('Ошибка при получении данных продуктов:', err);
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
  } finally {
    isLoading.value = false;
  }
};

const addToCart = (id: number) => {
  console.log('Добавлено в корзину:', id);
  // Логика добавления в корзину
};

// Загружаем данные при монтировании компонента
onMounted(() => {
  fetchPopularProducts();
});
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
          <!-- Отображение ошибки -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Индикатор загрузки -->
          <div v-if="isLoading" class="loading">
            Загрузка популярных товаров...
          </div>

          <!-- Содержимое секции товаров -->
          <div v-if="!isLoading && !error">
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

<style lang="scss" scoped>
.error-message {
  color: red;
  padding: 20px;
  text-align: center;
  background-color: #ffeeee;
  border-radius: 5px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
}
</style>