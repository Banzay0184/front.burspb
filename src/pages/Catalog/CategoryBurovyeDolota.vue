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
const categorySlug = computed(() => route.params.slug?.toString() || '');

// Текущая страница
const currentPage = computed(() => {
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
  
  // Добавляем данные из breadcrumbs API, если они есть
  if (categoryData.value?.breadcrumbs && Array.isArray(categoryData.value.breadcrumbs)) {
    crumbs.push(...categoryData.value.breadcrumbs);
  }

  // Добавляем текущую категорию, если она не включена в breadcrumbs
  if (categoryData.value?.category?.title) {
    const currentCategory = {
      title: categoryData.value.category.title,
      slug: categorySlug.value
    };

    // Проверяем, нет ли уже такой категории в крошках
    const isDuplicate = crumbs.some(crumb => 
      crumb.title === currentCategory.title && crumb.slug === currentCategory.slug
    );

    if (!isDuplicate) {
      crumbs.push(currentCategory);
    }
  }
  
  return crumbs;
});

// Загрузка данных категории
const fetchCategoryData = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const params = new URLSearchParams();
    params.append('page', currentPage.value.toString());
    params.append('sort', sortParam.value);
    
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
    
    if (data.category?.title) {
      categoryTitle.value = data.category.title;
    }
    
    if (data.nested_categories && Array.isArray(data.nested_categories)) {
      nestedCategories.value = data.nested_categories.map((cat: any) => ({
        title: cat.title,
        url: `/catalog/selection-${cat.slug}`
      }));
    } else {
      nestedCategories.value = [];
    }
    
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
    
    if (data.pagination) {
      totalPages.value = Number(data.pagination.pages_total) || 1;
      // НЕ обновляем currentPage из API, так как он уже установлен из URL
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
  // Временно отключено для отладки
  // fetchCategoryData();
};

// Обработчик изменения фильтра цены
const handlePriceFilterChange = (min: string | null, max: string | null) => {
  minPrice.value = min;
  maxPrice.value = max;
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
    router.push(`/catalog/selection-${categorySlug.value}`);
  } else {
    router.push(`/catalog/selection-${categorySlug.value}/page/${page}`);
  }
};

// Наблюдение за изменением параметров маршрута
watch(
  [() => route.params.slug, () => route.params.page],
  ([newSlug, newPage], [oldSlug, oldPage]) => {
    
    // Загружаем данные при изменении параметров
    if (!oldSlug || newSlug !== oldSlug || newPage !== oldPage) {
      fetchCategoryData();
      if (oldSlug) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  },
  { immediate: true }
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
            v-if="totalPages > 1 && currentPage"
            :current-page="currentPage"
            :total-pages="totalPages"
            :base-url="`/catalog/selection-${categorySlug}`"
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

