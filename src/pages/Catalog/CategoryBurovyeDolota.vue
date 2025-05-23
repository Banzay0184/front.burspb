<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import CategoryNested from '../../components/CategoryNested.vue';
import Pagination from '../../components/Pagination.vue';
import SectionTitleFilter from '../../components/SectionTitleFilter.vue';
import Cards from '../../components/Cards.vue';
import { CartService } from '../../api/api';
import { getApiUrl } from '../../api/api';

// Получение параметров маршрута
const route = useRoute();
const router = useRouter();
const categorySlug = computed(() => route.params.slug?.toString() || 'burovye-dolota');
const pageFromRoute = computed(() => {
  const page = route.params.page;
  return page ? parseInt(page.toString(), 10) : 1;
});

// Состояние для данных категории
const isLoading = ref(false);
const error = ref<string | null>(null);
const categoryData = ref<any>(null);
const nestedCategories = ref<Array<{ title: string, url: string }>>([]);
const cardsList = ref<Array<any>>([]);
const categoryTitle = ref('Товары каталога');
const currentPage = ref(pageFromRoute.value);
const totalPages = ref(1);


// Параметры фильтрации и сортировки
const sortParam = ref('price-asc');
const minPrice = ref<string | null>(null);
const maxPrice = ref<string | null>(null);

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
  // Защита от повторных запросов
  if (isLoading.value) {
    return;
  }
  
  isLoading.value = true;
  error.value = null;
  
  try {
    // Добавляем параметры сортировки и фильтрации в URL запроса
    const params = new URLSearchParams();
    params.append('page', currentPage.value.toString());
    params.append('sort', sortParam.value);
    
    // Добавляем фильтры цены, если они заданы
    if (minPrice.value) {
      params.append('min_price', minPrice.value);
    }
    if (maxPrice.value) {
      params.append('max_price', maxPrice.value);
    }
    
    const apiUrl = getApiUrl(`category/slug/${categorySlug.value}?${params.toString()}`);
    
    const response = await fetch(apiUrl);
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
        title: product.title || 'Без названия',
        link: `/catalog/product-${product.slug}`,
        image: product.img?.webp_square_350 || product.img?.square_350 || product.img?.webp_full || product.img?.full || '',
        alt: product.img?.alt?.description || product.title || 'Изображение товара',
        available: product.meta?.availability !== false,
        articul: product.meta?.artikul || '',
        oldPrice: product.meta?.price_old ? `${product.meta.price_old} ₽` : '',
        currentPrice: product.meta?.price ? `${product.meta.price} ₽` : '0 ₽',
        showOldPrice: !!product.meta?.price_old,
        slug: product.slug || '',
        weight: product.meta?.weight ? `${product.meta.weight} кг` : ''
      }));
    } else {
      cardsList.value = [];
    }
    
    // Пагинация
    if (data.pagination) {
      totalPages.value = Number(data.pagination.pages_total) || 1;
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
    cardsList.value = [];
    nestedCategories.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Обработчик изменения сортировки
const handleSortChange = (value: string) => {
  sortParam.value = value;
  currentPage.value = 1; // Сбрасываем на первую страницу
  // Временно отключено для отладки
  // fetchCategoryData();
};

// Обработчик изменения фильтра цены
const handlePriceFilterChange = (min: string | null, max: string | null) => {
  minPrice.value = min;
  maxPrice.value = max;
  currentPage.value = 1; // Сбрасываем на первую страницу
  // Временно отключено для отладки
  // fetchCategoryData();
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
        available: product.available,
        weight: product.weight
      });
    }
  }
};

// Обработка изменения страницы
const handlePageChange = (page: number) => {
  if (page === 1) {
    // Для первой страницы переходим на базовый URL без суффикса /page/1
    router.push(`/catalog/category-${categorySlug.value}`);
  } else {
    // Для остальных страниц добавляем нужный суффикс
    router.push(`/catalog/category-${categorySlug.value}/page/${page}`);
  }
};

// Наблюдение за изменением параметров маршрута
watch(
  [() => route.params.slug, () => route.params.page],
  ([newSlug, newPage], [oldSlug, oldPage]) => {
    // Загружаем данные при первой загрузке или при реальном изменении параметров
    if (!oldSlug || newSlug !== oldSlug || newPage !== oldPage) {
      currentPage.value = pageFromRoute.value;
      fetchCategoryData();
      if (oldSlug) { // Прокручиваем только при изменении, не при первой загрузке
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  },
  { immediate: true } // Выполняем при первой загрузке
);
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
          <SectionTitleFilter 
            :title="categoryTitle"
            @sort-change="handleSortChange"
            @price-filter-change="handlePriceFilterChange"
            :sort-options="[
              { value: 'popularity-desc', label: 'От популярного к менее популярному' },
              { value: 'popularity-asc', label: 'От менее популярного к популярному' },
              { value: 'price-asc', label: 'От дешёвых к дорогим' },
              { value: 'price-desc', label: 'От дорогих к дешёвым' },
              { value: 'name-asc', label: 'По названию (А-Я)' },
              { value: 'name-desc', label: 'По названию (Я-А)' }
            ]" 
          />

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

