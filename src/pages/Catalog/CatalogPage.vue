<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Pagination from '../../components/Pagination.vue';
import SectionTitleFilter from '../../components/SectionTitleFilter.vue';
import Cards from '../../components/Cards.vue';
import CategoriesFull from './components/CategoriesFull.vue';
import { CartService } from '../../api/api';
import { getApiUrl } from '../../api/api';
import { useSeoWithPagination, getCategoryOgImage, getOpenGraphType } from '../../utils/seo';

// Получаем роутер и текущий маршрут
const route = useRoute();
const router = useRouter();

// Отладочная информация
// Route информация получена

// Состояние компонента
const cardsList = ref<any[]>([]);
const cardsListAdditional = ref<any[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Пагинация
const currentPage = ref(1);
const totalPages = ref(1);
const postsPerPage = ref(24);

// Параметры фильтрации
const sortType = ref('popularity-desc');
const priceMin = ref<string | null>(null);
const priceMax = ref<string | null>(null);
let fetchTimeout: number | null = null;

// Получаем предварительно загруженные данные из SSG initialState
const getInitialData = () => {
  if (typeof window !== 'undefined' && (window as any).__INITIAL_STATE__) {
    try {
      let initialState = (window as any).__INITIAL_STATE__;
      if (typeof initialState === 'string') {
        initialState = JSON.parse(initialState);
      }
      return {
        products: initialState.popularProducts || [],
        categories: initialState.categories || []
      };
    } catch (err) {
      // Тихо обрабатываем ошибку парсинга
      return { products: [], categories: [] };
    }
  }
  return { products: [], categories: [] };
};

// Функция преобразования данных продукта
const transformProduct = (product: any) => ({
  id: product.id,
  title: product.title?.length > 40 ? `${product.title.substring(0, 40)}…` : (product.title || 'Без названия'),
  link: `/catalog/product-${product.slug}`,
  image: product.img?.webp_square_350 || product.img?.square_350 || product.img?.webp_full || product.img?.full || '',
  alt: product.img?.alt?.description || product.title || 'Изображение товара',
  availability: product.meta?.availability || false,
  articul: product.meta?.artikul || '',
  oldPrice: product.meta?.price_old ? `${product.meta.price_old} ₽` : '',
  currentPrice: product.meta?.price ? `${product.meta.price} ₽` : '0 ₽',
  showOldPrice: !!product.meta?.price_old,
  slug: product.slug || '',
  views: product.meta?.views || 0
});

// Инициализация параметров из URL
const initParamsFromUrl = () => {
  const page = Number(route.query.page) || 1;
  const sort = route.query.sort as string || 'popularity-desc';
  const min = route.query.price_min as string || null;
  const max = route.query.price_max as string || null;

  currentPage.value = page;
  sortType.value = sort;
  priceMin.value = min;
  priceMax.value = max;
};

// Обновление URL при изменении параметров
const updateUrl = () => {
  const query: Record<string, string> = {};
  
  if (currentPage.value > 1) {
    query.page = currentPage.value.toString();
  }
  
  if (sortType.value !== 'popularity-desc') {
    query.sort = sortType.value;
  }
  
  if (priceMin.value) {
    query.price_min = priceMin.value;
  }
  
  if (priceMax.value) {
    query.price_max = priceMax.value;
  }

  // Обновляем URL без перезагрузки страницы
  router.replace({ 
    path: route.path,
    query: Object.keys(query).length ? query : undefined
  });
};

// Следим за изменениями параметров
watch([currentPage, sortType, priceMin, priceMax], () => {
  updateUrl();
});

// Инициализация SEO с правильной обработкой пагинации
const updateSeo = () => {
  const basePath = '/catalog';
  
  // Динамическое изображение для каталога
  const ogImage = getCategoryOgImage(cardsList.value, 'catalog');
  const ogType = getOpenGraphType('website');

  useSeoWithPagination({
    // title убран - будет использоваться автоматическое определение или данные из API
    currentPage: currentPage.value,
    basePath,
    image: ogImage,
    type: ogType
  });
};

// Обновляем SEO при изменении страницы
watch([currentPage], updateSeo, { immediate: true });

// Функция для запроса данных с API
const fetchProducts = async () => {
  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
  }

  return new Promise<void>((resolve) => {
    fetchTimeout = setTimeout(async () => {
      try {
        isLoading.value = true;
        error.value = null;

        // Сначала пытаемся использовать предварительно загруженные данные
        const initialData = getInitialData();
        
        if (initialData.products.length > 0 && currentPage.value === 1 && sortType.value === 'popularity-desc' && !priceMin.value && !priceMax.value) {
          // Используем предварительно загруженные данные для первой страницы каталога
          cardsList.value = initialData.products.map(transformProduct);
          totalPages.value = 1; // Для предварительно загруженных данных
          isLoading.value = false;
          resolve();
          return;
        }

        // Если предварительно загруженных данных нет или нужны другие параметры, делаем API запрос

        // Формируем параметры запроса
        const params = new URLSearchParams({
          page: currentPage.value.toString(),
          sort: sortType.value,
          posts_per_page: postsPerPage.value.toString()
        });

        if (priceMin.value) {
          params.append('price_min', priceMin.value);
        }
        if (priceMax.value) {
          params.append('price_max', priceMax.value);
        }

        const response = await fetch(`${getApiUrl()}/products?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при загрузке товаров');
        }

        if (data.pagination) {
          currentPage.value = data.pagination.current || 1;
          totalPages.value = data.pagination.pages_total || 1;
          postsPerPage.value = data.pagination.posts_per_page || 24;
        }
        
        // Преобразуем полученные данные в формат, ожидаемый компонентом Cards
        cardsList.value = data.posts.map(transformProduct);
        
              } catch (err: any) {
        // Тихо обрабатываем ошибку загрузки
        error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
        cardsList.value = [];
      } finally {
        isLoading.value = false;
        fetchTimeout = null;
        resolve();
      }
    }, 300);
  });
};

// Очистка таймаута при размонтировании компонента
onUnmounted(() => {
  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
  }
});

// Обработчики событий
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchProducts();
  // Прокрутка страницы вверх при смене страницы
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSortChange = (sort: string) => {
  
  // Сохраняем текущую позицию скролла
  const scrollPosition = window.scrollY;
  
  sortType.value = sort;
  currentPage.value = 1; // Сбрасываем на первую страницу при изменении сортировки
  
  // Вызываем fetchProducts с сохранением позиции скролла
  fetchProducts().then(() => {
    // Восстанавливаем позицию скролла после обновления DOM
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  });
};

const handlePriceFilterChange = (min: string | null, max: string | null) => {
  // Сохраняем текущую позицию скролла
  const scrollPosition = window.scrollY;
  
  priceMin.value = min;
  priceMax.value = max;
  currentPage.value = 1; // Сбрасываем на первую страницу при изменении фильтра цены
  
  // Вызываем fetchProducts с сохранением позиции скролла
  fetchProducts().then(() => {
    // Восстанавливаем позицию скролла после обновления DOM
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  });
};

const addToCart = (id: number) => {
  // Находим товар в списке
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
      });
    }
  }
};

// Инициализация при монтировании
onMounted(() => {
  initParamsFromUrl();
  // Загружаем товары только в браузере
  if (typeof window !== 'undefined') {
  fetchProducts();
  }
});

// Хлебные крошки
const breadcrumbs = computed(() => [
  { title: 'Главная', url: '/' },
  { title: 'Каталог', url: '/catalog' }
]);
</script>

<template>
    <div class="main">
        <div class="wrapper category-products">

            <Breadcrumbs :items="breadcrumbs" /> 

            <section class="section selected-products category-products__nav">
                <div class="section-title"><h1 class="section-title-tag">Каталог продукции</h1></div>
               <CategoriesFull/>
            </section>

            <section class="section selected-products">
                <!-- Фильтр и заголовок -->
                <SectionTitleFilter 
                  title="Товары каталога"
                  @sort-change="handleSortChange"
                  @price-filter-change="handlePriceFilterChange"
                />

                <!-- Отображение ошибки -->
                <div v-if="error" class="error-message">
                  {{ error }}
                </div>

                <!-- Индикатор загрузки -->
                <div v-if="isLoading" class="loading">
                  Загрузка товаров...
                </div>

                <!-- Содержимое каталога -->
                <template v-if="!isLoading && !error">
                  <!-- Сообщение, если товаров нет -->
                  <div v-if="cardsList.length === 0" class="no-products">
                    По вашему запросу товары не найдены. Пожалуйста, измените параметры фильтрации.
                  </div>

                  <!-- Список товаров -->
                <Cards
                    v-else
                  :initial-cards="cardsList" 
                  :additional-cards="cardsListAdditional"
                    :load-more="false"
                  @add-to-cart="addToCart"
                />

                  <!-- Пагинация -->
                  <Pagination 
                    :current-page="Number(currentPage)" 
                    :total-pages="totalPages" 
                    @page-change="handlePageChange"
                  />
                </template>
            </section>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.categories-full>ul>li {
  margin-bottom:3rem;
  position:relative
}
.categories-full>ul>li li {
  padding-left:5.3rem;
  margin-bottom:.75rem
}
@media screen and (max-width:1199.99px) {
  .categories-full>ul>li>ul {
    display:none
  }
  .categories-full>ul>li.active>ul {
    display:block
  }
}
.categories-full__parent {
  font-weight:700;
  display:flex;
  flex-direction:row;
  line-height:1.2
}
.categories-full__parent span {
  min-width:3.8rem;
  max-width:3.8rem;
  flex-basis:3.8rem;
  margin-right:1.5rem
}
.categories-full__parent span img,
.categories-full__parent span svg {
  width:100%;
  height:auto
}
.categories-full__parent span .icon-background {
  fill:#0cf
}
@media screen and (max-width:1199.999px) {
  .categories-full__parent__mobile-action {
    display:inline-block;
    position:absolute;
    top:0;
    right:0;
    width:2rem;
    height:2rem;
    border:thin solid #aaa;
    border-radius:50%;
    cursor:pointer
  }
  .categories-full__parent__mobile-action:before {
    line-height:1;
    content:"";
    font-family:FontAwesome;
    font-size:1rem;
    display:inline-block;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    color:#aaa
  }
  .active .categories-full__parent__mobile-action:before {
    transform:translate(-50%,-50%) rotate(180deg)
  }
}
@media screen and (min-width:768px) {
  .categories-full>ul {
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    margin-left:-2.25rem;
    margin-right:-2.25rem
  }
  .categories-full>ul>li {
    display:block;
    width:calc(50% - 4.5rem);
    margin-left:2.25rem;
    margin-right:2.25rem
  }
}
@media screen and (min-width:1200px) {
  .categories-full>ul {
    margin-left:-1.5rem;
    margin-right:-1.5rem
  }
  .categories-full>ul>li {
    width:calc(25% - 3rem);
    margin-left:1.5rem;
    margin-right:1.5rem
  }
}

/* Новые стили */
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
}
</style>