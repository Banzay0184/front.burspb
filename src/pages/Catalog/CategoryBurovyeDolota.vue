<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import CategoryNested from '../../components/CategoryNested.vue';
import Pagination from '../../components/Pagination.vue';
import SectionTitleFilter from '../../components/SectionTitleFilter.vue';
import Cards from '../../components/Cards.vue';
import { CartService } from '../../api/api';
import { getApiUrl } from '../../api/api';
import type { Post } from '../../api/api';
import { debounce } from '../../utils/debounce';
import { cachedFetch } from '../../utils/apiCache';
import { 
  createBreadcrumbsSchema, 
  createWebSiteSchema,
  useSeoWithPagination,
  getOpenGraphType
} from '../../utils/seo';

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
const categoryData = ref<CategoryData | null>(null);
const nestedCategories = ref<Array<{
  nav_id: number;
  title: string;
  url: string;
  params: {
    is_link?: {
      title: string;
    };
  };
}>>([]);
const cardsList = ref<Array<any>>([]);
const categoryTitle = ref('Товары каталога');
const totalPages = ref(1);

// Кэширование уже реализовано через существующую систему cachedFetch
// Увеличили TTL до 5 минут для лучшей производительности

// Параметры фильтрации и сортировки
const sortParam = ref('popularity-desc');
const minPrice = ref<string | null>(null);
const maxPrice = ref<string | null>(null);

// Вычисляемые свойства
const hasProducts = computed(() => cardsList.value.length > 0);
const seoContent = computed(() => categoryData.value?.category?.seo?.description || '');

// Определение типа URL (selection или category)
const getUrlPrefix = () => {
  // Проверяем тип в первой вложенной категории
  const firstNestedCategory = categoryData.value?.nested_categories?.[0];
  const isTaxonomy = firstNestedCategory?.type === 'taxonomy';
  return isTaxonomy ? 'category' : 'selection';
};

interface CategoryBreadcrumb {
  title: string;
  slug: string;
  type?: string;
  isCurrent?: boolean;
  url?: string;
}

interface CategoryData {
  breadcrumbs: CategoryBreadcrumb[];
  nested_categories: Array<{
    nav_id: number;
    object_id: string;
    type: string;
    parent: string;
    icon: string | null;
    title: string;
    slug: string;
    params?: {
      is_link?: {
        title: string;
      };
    };
  }>;
  category: {
    id: number;
    title: string;
    icon: string | null;
    type?: string;
    seo: {
      description?: string;
      head_title?: string;
      title?: string;
      head_description?: string;
    };
  };
  pagination: {
    posts_per_page: number;
    current: string;
    previous: number | null;
    next: number | null;
    pages_total: number;
  };
  posts: Post[];
}

// Функция для получения размера из слага
const getSizeFromSlug = (slug: string) => {
  const withoutPrefix = slug.replace(/^(selection-|category-)/, '');
  const match = withoutPrefix.match(/-(\d+)-mm$/);
  return match ? `${match[1]} мм` : '';
};

// Функция для проверки, является ли слаг подкатегорией с размером
const isSizeSubcategory = (slug: string) => {
  const withoutPrefix = slug.replace(/^(selection-|category-)/, '');
  const sizePattern = /-\d+-mm$/;
  return sizePattern.test(withoutPrefix);
};

// Формирование хлебных крошек
const breadcrumbs = computed(() => {
  const crumbs: CategoryBreadcrumb[] = [
    { title: 'Главная', url: '/', slug: 'home' },
    { title: 'Каталог', url: '/catalog', slug: 'catalog' } 
  ];

  // Добавляем данные из breadcrumbs API
  if (categoryData.value?.breadcrumbs && Array.isArray(categoryData.value.breadcrumbs)) {
    crumbs.push(...categoryData.value.breadcrumbs.map((crumb: CategoryBreadcrumb) => {
      const type = crumb.type || 'taxonomy';
      return {
        ...crumb,
        type,
        slug: crumb.slug
      };
    }));
  }

  // Проверяем, является ли текущая категория подкатегорией с размером
  const currentSlug = categorySlug.value;
  if (isSizeSubcategory(currentSlug)) {
    const size = getSizeFromSlug(currentSlug);
    const withoutPrefix = currentSlug.replace(/^(selection-|category-)/, '');
    
    // Добавляем подкатегорию с размером
    crumbs.push({
      title: `Пневмоударники ${size}`,
      slug: withoutPrefix,
      type: 'taxonomy',
      isCurrent: true
    });
  } else if (categoryData.value?.category?.title) {
    // Для обычных категорий оставляем как есть
    const prefix = getUrlPrefix();
    crumbs.push({
      title: categoryData.value.category.title,
      slug: categorySlug.value,
      type: categoryData.value.category.type || (prefix === 'category' ? 'taxonomy' : 'post_type'),
      isCurrent: true
    });
  }

  return crumbs;
});

// Загрузка данных категории с кэшированием и обработкой ошибок
const fetchCategoryData = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Формируем параметры запроса
    const params = {
      page: currentPage.value.toString(),
      sort: sortParam.value,
      posts_per_page: '24',
      ...(minPrice.value && { price_min: minPrice.value }),
      ...(maxPrice.value && { price_max: maxPrice.value })
    };
    
    // Параметры запроса к API подготовлены

    // Определяем тип на основе имени маршрута
    // Исправление: раньше всегда использовался /category/slug/, теперь проверяем тип маршрута
    const isSelection = route.name === 'SelectionDetail' || route.name === 'SelectionDetailPagination';
    const apiEndpoint = isSelection ? '/selections/slug/' : '/category/slug/';
    
    // Используем существующую систему кэширования cachedFetch
    // ВАЖНО: включаем все параметры в ключ кэша для правильной работы сортировки
    const baseUrl = `${apiEndpoint}${categorySlug.value}`;
    const cacheKey = `${baseUrl}-${JSON.stringify(params)}`;
    
    // Ключ кэша сформирован
    
          const { data } = await cachedFetch(
      cacheKey, // Используем расширенный ключ с параметрами
      params,
      async () => {
        const paramString = new URLSearchParams(params).toString();
        const response = await fetch(`${getApiUrl()}${baseUrl}?${paramString}`);

    if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }
        
        return await response.json();
      },
      5 * 60 * 1000 // Увеличиваем TTL до 5 минут для лучшего кэширования
    );

          // Данные категории получены

    // Используем единую функцию для установки данных
    setCategoryDataFromResponse(data);
    
  } catch (err) {
    console.error('Ошибка при загрузке данных категории:', err);
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке категории';
    cardsList.value = [];
    nestedCategories.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Функция для установки данных из кэша или API ответа
const setCategoryDataFromResponse = (data: any) => {
    if (data) {
      categoryData.value = data;
      
      if (data.category?.title) {
        categoryTitle.value = data.category.title;
      }
      
    // Обработка вложенных категорий
      if (data.nested_categories && Array.isArray(data.nested_categories)) {
        nestedCategories.value = data.nested_categories.map((cat: any) => ({
          nav_id: cat.nav_id,
          title: cat.title,
          url: cat.type === 'taxonomy' 
            ? `/catalog/category-${cat.slug}` 
            : `/catalog/selection-${cat.slug}`,
          params: {
            is_link: cat.params?.is_link
          }
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
          availability: product.meta?.availability || false,
          articul: product.meta?.artikul || '',
          oldPrice: product.meta?.price_old ? `${product.meta.price_old} ₽` : '',
          currentPrice: product.meta?.price ? `${product.meta.price} ₽` : '0 ₽',
          showOldPrice: !!product.meta?.price_old,
          slug: product.slug || '',
          weight: product.meta?.weight ? `${product.meta.weight} кг` : '',
          views: product.meta?.views || 0
        }));
      } else {
        cardsList.value = [];
      }
      
    // Обработка пагинации
      if (data.pagination) {
        totalPages.value = Number(data.pagination.pages_total) || 1;
    }

    // Обновляем SEO
    updateSeoData();
  }
};

// Обновление SEO данных на основе данных из API
const updateSeoData = () => {
  if (!categoryData.value || !categoryData.value.category) {
    return;
  }

  // Используем данные из API для SEO
  const seoData = categoryData.value.category?.seo;
  
  // Title: используем head_title из API или формируем из названия категории
  let title = '';
  if (seoData?.head_title) {
    // Если есть head_title из API, используем его
    title = seoData.head_title;
  } else if (seoData?.title) {
    // Если есть просто title, добавляем суффикс
    title = `${seoData.title} — Оборудование для бурения №1 в России`;
  } else {
    // Если нет SEO данных, формируем из названия категории
    const categoryTitle = categoryData.value.category?.title;
    title = `${categoryTitle} — Оборудование для бурения №1 в России`;
  }
  
  // Description: используем head_description из API
  const categoryTitle = categoryData.value.category?.title || 'товары';
  const description = seoData?.head_description ||
    seoData?.description?.replace(/<[^>]*>/g, '').slice(0, 160) + '...' ||
    `Купить ${categoryTitle.toLowerCase()} в интернет-магазине. Широкий ассортимент бурового оборудования, доставка по России, гарантия качества.`;

  const basePath = `/catalog/${getUrlPrefix()}-${categorySlug.value}`;

  // Open Graph title: используем title как есть
  const ogTitle = title;
  
  // Open Graph description: используем head_description или обрезаем description
  const ogDescription = seoData?.head_description ||
    (seoData?.description 
      ? seoData.description.replace(/<[^>]*>/g, '').slice(0, 300) + '...'
      : description);

  // Динамическое Open Graph изображение - берем из первого товара или дефолтное
  const ogImage = cardsList.value.length > 0 && cardsList.value[0].image
    ? (cardsList.value[0].image.startsWith('http') 
       ? cardsList.value[0].image 
       : `https://burspb.com${cardsList.value[0].image}`)
    : 'https://burspb.com/default-image.jpg';
  
  // Тип Open Graph - website для категорий
  const ogType = getOpenGraphType('website');

  // Создаем структурированные данные для хлебных крошек
  const breadcrumbsSchema = createBreadcrumbsSchema(
    breadcrumbs.value.map(crumb => ({
      title: crumb.title,
      url: crumb.url || '',
      position: breadcrumbs.value.indexOf(crumb) + 1
    }))
  );

  // Создаем схему веб-сайта с поиском
  const websiteSchema = createWebSiteSchema();

  // Используем улучшенную функцию SEO с правильной обработкой пагинации
  useSeoWithPagination({
    title,
    description,
    currentPage: currentPage.value,
    basePath,
    image: ogImage,
    type: ogType,
    // Дополнительные Open Graph данные
    ogTitle,
    ogDescription,
    // noindex и nofollow обрабатываются автоматически функцией useSeoWithPagination
    structuredData: {
      ...websiteSchema,
      ...(breadcrumbsSchema && { breadcrumbs: breadcrumbsSchema })
    }
  });
};

// Дебаунсированная версия fetchCategoryData для предотвращения множественных запросов
const debouncedFetchCategoryData = debounce(
  fetchCategoryData, 
  300, // 300ms задержка
  { 
    leading: false, 
    trailing: true 
  }
);

// Обработчик изменения сортировки
const handleSortChange = (value: string) => {
  sortParam.value = value;
  debouncedFetchCategoryData();
};

// Обработчик изменения фильтра цены
const handlePriceFilterChange = (min: string | null, max: string | null) => {
  // Сохраняем текущую позицию скролла
  const scrollPosition = window.scrollY;
  
  minPrice.value = min;
  maxPrice.value = max;
  
  // Вызываем дебаунсированную функцию для загрузки данных
  debouncedFetchCategoryData();
    // Восстанавливаем позицию скролла после обновления DOM
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
  });
};

// Обработка добавления в корзину
const addToCart = (id: number) => {
  const product = cardsList.value.find(item => item.id === id);
  if (product) {
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
        availability: product.availability || false,
        weight: product.weight
      });
    }
  }
};

// Обработка изменения страницы
const handlePageChange = (page: number) => {
  const prefix = getUrlPrefix();
  if (page === 1) {
    router.push(`/catalog/${prefix}-${categorySlug.value}`);
  } else {
    router.push(`/catalog/${prefix}-${categorySlug.value}/page/${page}`);
  }
};

// Переменная для отслеживания предыдущих параметров
let previousParams = {
  slug: '',
  page: '',
  sort: '',
  minPrice: '',
  maxPrice: ''
};

// Наблюдение за изменением параметров маршрута с оптимизацией
watch(
  [categorySlug, currentPage],
  ([newSlug, newPage], []) => {
    const currentParams = {
      slug: newSlug?.toString() || '',
      page: newPage?.toString() || '',
      sort: sortParam.value,
      minPrice: minPrice.value || '',
      maxPrice: maxPrice.value || ''
    };

    // Проверяем, действительно ли изменились ключевые параметры
    const hasRealChanges = (
      currentParams.slug !== previousParams.slug ||
      currentParams.page !== previousParams.page ||
      currentParams.sort !== previousParams.sort ||
      currentParams.minPrice !== previousParams.minPrice ||
      currentParams.maxPrice !== previousParams.maxPrice
    );

    if (hasRealChanges) {
      // Параметры маршрута изменились

      // Загружаем данные
      fetchCategoryData();
      
      // Прокрутка вверх только при смене категории или страницы
      if (previousParams.slug && currentParams.slug !== previousParams.slug ||
          previousParams.page !== currentParams.page) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Обновляем предыдущие параметры
      previousParams = { ...currentParams };
    }
  },
  { immediate: true }
);

// Очистка при размонтировании компонента
onUnmounted(() => {
  if (debouncedFetchCategoryData.pending()) {
    debouncedFetchCategoryData.cancel();
  }
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
        <h3>Ошибка загрузки</h3>
        <p>{{ error }}</p>
        <button @click="fetchCategoryData" class="retry-button">
          Попробовать снова
        </button>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Загрузка товаров...</p>
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
            :base-url="`/catalog/${getUrlPrefix()}-${categorySlug}`"
            @page-change="handlePageChange"
          />
        </section>

        <!-- Сообщение, если товаров нет -->
        <div v-else class="no-products">
          <h3>Товары не найдены</h3>
          <p>В данной категории товары отсутствуют или не соответствуют выбранным фильтрам.</p>
        </div>

        <!-- SEO контент -->
        <section v-if="seoContent" class="section seo-content">
          <div class="content" v-html="seoContent"></div>
        </section>

      </template>
    </div>
</main>
</template>

<style scoped>
.error-message {
  color: #d32f2f;
  padding: 24px;
  text-align: center;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  margin-bottom: 24px;
}

.error-message h3 {
  margin: 0 0 8px 0;
  font-size: 1.2em;
  font-weight: 600;
}

.error-message p {
  margin: 0 0 16px 0;
  color: #666;
}

.retry-button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #1565c0;
}

.loading {
  text-align: center;
  padding: 48px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin: 0;
  font-size: 1.1em;
}

.no-products {
  text-align: center;
  padding: 48px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.no-products h3 {
  margin: 0 0 8px 0;
  font-size: 1.3em;
  color: #333;
}

.no-products p {
  margin: 0;
  color: #666;
  font-size: 1em;
}

.seo-content {
  margin-top: 32px;
}

.seo-content .content {
  line-height: 1.6;
  color: #555;
}

.seo-content .content h1,
.seo-content .content h2,
.seo-content .content h3 {
  color: #333;
  margin-top: 24px;
  margin-bottom: 12px;
}

.seo-content .content p {
  margin-bottom: 16px;
}

.seo-content .content ul,
.seo-content .content ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

.seo-content .content li {
  margin-bottom: 8px;
}
</style>

