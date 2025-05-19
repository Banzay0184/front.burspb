<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Pagination from '../../components/Pagination.vue';
import SectionTitleFilter from '../../components/SectionTitleFilter.vue';
import Cards from '../../components/Cards.vue';
import CategoriesFull from './components/CategoriesFull.vue';

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
const sortType = ref('');
const priceMin = ref<string | null>(null);
const priceMax = ref<string | null>(null);

// Функция для запроса данных с API
const fetchProducts = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Формируем строку параметров запроса
    const params = new URLSearchParams();
    if (currentPage.value > 1) {
      params.append('page', currentPage.value.toString());
    }
    if (sortType.value) {
      params.append('sort', sortType.value);
    }
    if (priceMin.value) {
      params.append('price_min', priceMin.value);
    }
    if (priceMax.value) {
      params.append('price_max', priceMax.value);
    }
    
    // Выполняем запрос к API
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`https://burspb.com/api/data/v1/products/${queryString}`);
    
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status}`);
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
    
    // Очищаем дополнительные карточки, так как теперь используем пагинацию
    cardsListAdditional.value = [];
    
  } catch (err) {
    console.error('Ошибка при получении данных продуктов:', err);
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
  } finally {
    isLoading.value = false;
  }
};

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
  console.log('Добавлено в корзину:', id);
  // Логика добавления в корзину
};

// Загружаем данные при монтировании компонента
onMounted(() => {
  fetchProducts();
});
</script>

<template>
    <div class="main">
        <div class="wrapper category-products">

            <Breadcrumbs />

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
                    base-url="/Catalog/CatalogPage"
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