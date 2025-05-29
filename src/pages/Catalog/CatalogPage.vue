<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Pagination from '../../components/Pagination.vue';
import SectionTitleFilter from '../../components/SectionTitleFilter.vue';
import Cards from '../../components/Cards.vue';
import CategoriesFull from './components/CategoriesFull.vue';
import { CartService } from '../../api/api';
import { getApiUrl } from '../../api/api';

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
const sortType = ref('price-asc');
const priceMin = ref<string | null>(null);
const priceMax = ref<string | null>(null);
let fetchTimeout: number | null = null;

// Функция для запроса данных с API
const fetchProducts = async () => {
  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
  }

  fetchTimeout = window.setTimeout(async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Формируем строку параметров запроса
      const params = new URLSearchParams();
      
      // Добавляем параметры пагинации
      if (currentPage.value > 1) {
        params.append('page', currentPage.value.toString());
      }
      
      // Добавляем параметры сортировки
      if (sortType.value) {
        params.append('sort', sortType.value);
      }
      
      // Добавляем параметры фильтрации по цене
      if (priceMin.value !== null && priceMin.value !== '') {
        const minPrice = parseInt(priceMin.value);
        if (!isNaN(minPrice) && minPrice >= 0) {
          params.append('price_min', minPrice.toString());
        }
      }
      
      if (priceMax.value !== null && priceMax.value !== '') {
        const maxPrice = parseInt(priceMax.value);
        if (!isNaN(maxPrice) && maxPrice >= 0) {
          params.append('price_max', maxPrice.toString());
        }
      }
      
      // Выполняем запрос к API
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const apiUrl = getApiUrl(`products/${queryString}`);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Обрабатываем данные пагинации
      if (data.pagination) {
        currentPage.value = data.pagination.current || 1;
        totalPages.value = data.pagination.pages_total || 1;
        postsPerPage.value = data.pagination.posts_per_page || 24;
      }
      
      // Преобразуем полученные данные в формат, ожидаемый компонентом Cards
      cardsList.value = data.posts.map((product: any) => ({
        id: product.id,
        title: product.title?.length > 40 ? `${product.title.substring(0, 40)}…` : (product.title || 'Без названия'),
        link: `/catalog/product-${product.slug}`,
        image: product.img?.webp_square_350 || product.img?.square_350 || product.img?.webp_full || product.img?.full || '',
        alt: product.img?.alt?.description || product.title || 'Изображение товара',
        available: true,
        isOrderable: !product.meta?.availability,
        articul: product.meta?.artikul || '',
        oldPrice: product.meta?.price_old ? `${product.meta.price_old} ₽` : '',
        currentPrice: product.meta?.price ? `${product.meta.price} ₽` : '0 ₽',
        showOldPrice: !!product.meta?.price_old,
        slug: product.slug || ''
      }));
      
    } catch (err: any) {
      console.error('Error fetching products:', err);
      error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
      cardsList.value = [];
    } finally {
      isLoading.value = false;
      fetchTimeout = null;
    }
  }, 300); // Добавляем небольшую задержку для предотвращения частых запросов
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
  sortType.value = sort;
  currentPage.value = 1; // Сбрасываем на первую страницу при изменении сортировки
  fetchProducts();
};

const handlePriceFilterChange = (min: string | null, max: string | null) => {
  priceMin.value = min;
  priceMax.value = max;
  currentPage.value = 1; // Сбрасываем на первую страницу при изменении фильтра цены
  fetchProducts();
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
        available: true,
        isOrderable: product.isOrderable || false
      });
    }
  }
};

// Загружаем данные при монтировании компонента
onMounted(() => {
  fetchProducts();
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
                    v-if="totalPages > 1"
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    base-url="/catalog"
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