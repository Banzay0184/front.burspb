<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import CategoryNested from '../../components/CategoryNested.vue';
import Pagination from '../../components/Pagination.vue';
import SectionTitleFilter from '../../components/SectionTitleFilter.vue';
import Cards from '../../components/Cards.vue';
import apiService from '../../api/api';
import { CartService } from '../../api/api';

// Получение параметров маршрута
const route = useRoute();
const categorySlug = computed(() => route.params.slug?.toString() || 'burovye-dolota');

// Состояние для данных категории
const isLoading = ref(true);
const error = ref<string | null>(null);
const categoryData = ref<any>(null);
const nestedCategories = ref<Array<{ title: string, url: string }>>([]);
const cardsList = ref<Array<any>>([]);
const categoryTitle = ref('Товары каталога');
const currentPage = ref(1);
const totalPages = ref(1);

// Вычисляемые свойства
const hasProducts = computed(() => cardsList.value.length > 0);
const seoContent = computed(() => categoryData.value?.category?.seo?.description || '');

// Формирование хлебных крошек
const breadcrumbs = computed(() => {
  const crumbs = [];
  
  // Добавить Каталог
  crumbs.push({
    title: 'Каталог',
    url: '/Catalog/CatalogPage'
  });
  
  // Добавить текущую категорию
  if (categoryData.value?.category?.title) {
    crumbs.push({
      title: categoryData.value.category.title,
      url: ''  // Текущая страница, без URL
    });
  }
  
  return crumbs;
});

// Загрузка данных категории
const fetchCategoryData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`https://burspb.com/api/data/v1/category/slug/${categorySlug.value}`);
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке данных: ${response.status}`);
    }
    
    const data = await response.json();
    categoryData.value = data;
    
    // Установка названия категории
    if (data.category && data.category.title) {
      categoryTitle.value = data.category.title;
    }
    
    // Обработка вложенных категорий
    if (data.nested_categories && Array.isArray(data.nested_categories)) {
      nestedCategories.value = data.nested_categories.map((cat: any) => ({
        title: cat.title,
        url: `/catalog/category-${cat.slug}`
      }));
    } else {
      nestedCategories.value = [];
    }
    
    // Обработка товаров
    if (data.posts && Array.isArray(data.posts)) {
      cardsList.value = data.posts.map((product: any) => ({
        id: product.id,
        title: product.title,
        link: `/catalog/product-${product.slug}`,
        image: product.img.webp_square_350 || product.img.square_350 || '',
        alt: product.img.alt?.description || product.title,
        available: product.meta.availability,
        articul: product.meta.artikul || '',
        oldPrice: product.meta?.price_old ? `${product.meta.price_old} ₽` : '',
        currentPrice: `${product.meta.price} ₽`,
        showOldPrice: !!product.meta?.price_old,
        slug: product.slug
      }));
    } else {
      cardsList.value = [];
    }
    
    // Пагинация
    if (data.pagination) {
      currentPage.value = data.pagination.current || 1;
      totalPages.value = data.pagination.pages_total || 1;
    }
    
  } catch (err) {
    console.error('Ошибка при получении данных категории:', err);
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
    cardsList.value = [];
    nestedCategories.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Обработка добавления в корзину
const addToCart = (id: number) => {
  const product = cardsList.value.find(item => item.id === id);
  if (product && product.available) {
    // Если товар уже в корзине, увеличиваем количество
    if (CartService.isInCart(id)) {
      const currentQuantity = CartService.getItemQuantity(id);
      CartService.updateItemQuantity(id, currentQuantity + 1);
    } else {
      // Добавляем новый товар в корзину
      CartService.addToCart({
        id: product.id,
        title: product.title,
        price: product.currentPrice,
        image: product.image,
        articul: product.articul,
        quantity: 1,
        slug: product.slug,
        available: product.available
      });
    }
  }
};

// Обработка изменения страницы
const handlePageChange = (page: number) => {
  currentPage.value = page;
  // Прокрутка страницы вверх при смене страницы
  window.scrollTo({ top: 0, behavior: 'smooth' });
  fetchCategoryData();
};

// Наблюдение за изменением параметра slug в URL
watch(() => route.params.slug, (newSlug, oldSlug) => {
  if (newSlug !== oldSlug) {
    console.log(`Категория изменена: ${oldSlug} -> ${newSlug}`);
    fetchCategoryData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}, { immediate: true });

// Инициализация загрузки данных
onMounted(() => {
  fetchCategoryData();
});
</script>

<template>
  <main class="main">
    <div class="wrapper category-products">
      <!-- Хлебные крошки -->
      <Breadcrumbs :items="breadcrumbs" />

      <!-- Вложенные категории -->
      <CategoryNested 
        v-if="nestedCategories.length > 0" 
        :items="nestedCategories" 
      />

      <!-- Ошибка загрузки -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="loading">
        Загрузка...
      </div>

      <!-- Содержимое категории -->
      <template v-if="!isLoading && !error">
        <!-- Товары -->
        <section v-if="hasProducts" class="section selected-products">
          <SectionTitleFilter :title="categoryTitle" />

            <Cards
                :initial-cards="cardsList" 
            :additional-cards="[]"
                :load-more="false"
                @add-to-cart="addToCart"
            />

          <Pagination 
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            :base-url="`/catalog/category-${categorySlug}`"
            @page-change="handlePageChange"
          />
        </section>

        <!-- Сообщение, если товаров нет -->
        <div v-else class="no-products">
          В данной категории товары отсутствуют.
        </div>

        <!-- SEO контент -->
        <section v-if="seoContent" class="section oes">
          <div class="content" v-html="seoContent"></div>
        </section>
      </template>
    </div>
</main>
</template>

<style scoped>
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

.no-products {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>

