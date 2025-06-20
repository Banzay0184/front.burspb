<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Cards from '../../components/Cards.vue';
import { CartService } from '../../api/api';
import { getApiUrl } from '../../api/api';
import { useSeo } from '../../utils/seo';

// Получаем данные из URL
const route = useRoute();
const searchQuery = computed(() => route.query.search?.toString() || '');

// Состояние поиска
const isLoading = ref(false);
const error = ref<string | null>(null);
const productResults = ref<any[]>([]);
const categoryResults = ref<any[]>([]);
const articleResults = ref<any[]>([]);

// Вычисляемые свойства
const hasResults = computed(() => 
  productResults.value.length > 0 || 
  categoryResults.value.length > 0 || 
  articleResults.value.length > 0
);

// Хлебные крошки
const breadcrumbs = computed(() => {
  const crumbs = [
    { title: 'Главная', url: '/' },
    { title: 'Поиск', url: '/search' }
  ];
  
  if (searchQuery.value) {
    crumbs.push({
      title: `Результаты поиска: ${searchQuery.value}`,
      url: '',
    });
  }
  
  return crumbs;
});

// Заголовок страницы
const pageTitle = computed(() => {
  return searchQuery.value ? 
    `Результаты поиска: ${searchQuery.value}` : 
    'Поиск';
});

// Инициализация SEO с правильными каноническими ссылками
const updateSeo = () => {
  const title = searchQuery.value 
    ? `Результаты поиска: ${searchQuery.value} — Оборудование для бурения №1 в России`
    : 'Поиск — Оборудование для бурения №1 в России';
  const description = searchQuery.value
    ? `Результаты поиска по запросу "${searchQuery.value}" в каталоге бурового оборудования и инструментов.`
    : 'Поиск по каталогу бурового оборудования и инструментов. Найдите нужное оборудование быстро и просто.';
  const canonical = searchQuery.value ? '/search' : route.path;

  useSeo({
    title,
    description,
    canonical,
    noindex: !!searchQuery.value // не индексируем страницы результатов поиска
  });
};

// Обновляем SEO при изменении поискового запроса
watch(searchQuery, updateSeo, { immediate: true });

// Функция поиска
const performSearch = async () => {
  if (!searchQuery.value) return;
  
  isLoading.value = true;
  error.value = null;
  productResults.value = [];
  categoryResults.value = [];
  articleResults.value = [];
  
  try {
    const response = await fetch(getApiUrl(`search?search=${encodeURIComponent(searchQuery.value)}`));
    
    if (!response.ok) {
      throw new Error(`Ошибка при поиске: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Обрабатываем товары из products.posts
    if (data.products?.posts && Array.isArray(data.products.posts)) {
      productResults.value = data.products.posts.map(formatProduct);
    }
    
    // Обрабатываем статьи из recent.content.posts
    if (data.recent?.content?.posts && Array.isArray(data.recent.content.posts)) {
      articleResults.value = data.recent.content.posts.map(formatArticle);
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка при выполнении поиска';
  } finally {
    isLoading.value = false;
  }
};

// Функции форматирования результатов
const formatProduct = (product: any): any => {
  return {
    id: product.id || Math.random() * 100000,
    title: product.title || 'Без названия',
    link: product.link || `/catalog/product-${product.slug || ''}`,
    image: product.img?.webp_square_350 || product.img?.square_350 || product.img?.webp_full || product.img?.full || '',
    alt: product.img?.alt?.description || product.title || 'Товар',
    availability: product.meta.availability || false,
    articul: product.meta?.artikul || '',
    oldPrice: product.meta?.price_old ? `${product.meta.price_old} ₽` : '',
    currentPrice: product.meta?.price ? `${product.meta.price} ₽` : '0 ₽',
    showOldPrice: !!product.meta?.price_old,
    slug: product.slug || '',
    weight: product.meta?.weight ? `${product.meta.weight} кг` : ''
  };
};

const formatArticle = (article: any): any => {
  return {
    id: article.id || Math.random() * 100000,
    title: article.title || 'Без названия',
    url: article.url || `/statji/${article.slug || ''}`,
    date: article.date || '',
    image: article.img?.webp_square_350 || article.img?.square_350 || article.img?.webp_full || article.img?.full || '',
    excerpt: article.excerpt || ''
  };
};

// Обработка добавления товара в корзину
const addToCart = (id: number) => {
  const product = productResults.value.find(item => item.id === id);
  if (product) {
    if (CartService.isInCart(id)) {
      const currentQuantity = CartService.getItemQuantity(id);
      CartService.updateItemQuantity(id, currentQuantity + 1);
    } else {
      CartService.addToCart({
        id: product.id,
        title: product.title,
        price: product.currentPrice,
        image: product.image,
        articul: product.articul || '',
        quantity: 1,
        slug: product.slug,
        availability: product.availability || false,
        weight: product.weight || ''
      });
    }
  }
};

// Выполняем поиск при монтировании компонента
onMounted(() => {
  if (searchQuery.value) {
    performSearch();
  }
});

// Следим за изменением параметра запроса
watch(() => route.query.search, (newQuery) => {
  if (newQuery) {
    performSearch();
  } else {
    productResults.value = [];
    categoryResults.value = [];
    articleResults.value = [];
  }
});
</script>

<template>
    <main class="main">
        <div class="wrapper">
      <Breadcrumbs :items="breadcrumbs" />

            <section class="section selected-products">
                <div class="section-title">
          <h1 class="section-title-tag">{{ pageTitle }}</h1>
        </div>

        <!-- Индикатор загрузки -->
        <div v-if="isLoading" class="loading">
          <i class="fa fa-spinner fa-spin"></i> Поиск...
        </div>

        <!-- Сообщение об ошибке -->
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Результаты поиска -->
        <template v-else>
          <!-- Если ничего не найдено -->
          <div v-if="!hasResults && searchQuery" class="not-found">
            <h3 class="not-found__title">Записи не найдены</h3>
            <p class="not-found__description">Попробуйте изменить критерии запроса</p>
          </div>

          <!-- Категории -->
          <div v-if="categoryResults.length > 0" class="search-section">
            <h4 class="search-section-title">Категории</h4>
            <div class="category-list">
              <a 
                v-for="category in categoryResults" 
                :key="`category-${category.id}`"
                :href="category.url"
                class="category-item"
              >
                <i class="fa fa-folder-o"></i>
                <span>{{ category.title }}</span>
              </a>
            </div>
          </div>

          <!-- Товары -->
          <div v-if="productResults.length > 0" class="search-section">
            <h4 class="search-section-title">Товары</h4>
            <Cards
              :initial-cards="productResults"
              :additional-cards="[]"
              :load-more="false"
              @add-to-cart="addToCart"
            />
          </div>

          <!-- Статьи -->
          <div v-if="articleResults.length > 0" class="search-section">
            <h4 class="search-section-title">Статьи</h4>
            <div class="article-list">
              <a 
                v-for="article in articleResults" 
                :key="`article-${article.id}`"
                :href="article.url"
                class="article-item"
              >
                <div class="article-image" v-if="article.image">
                  <img :src="article.image" :alt="article.title">
                </div>
                <div class="article-content">
                  <h5 class="article-title">{{ article.title }}</h5>
                  <div class="article-date" v-if="article.date">{{ article.date }}</div>
                  <div class="article-excerpt" v-if="article.excerpt" v-html="article.excerpt"></div>
                </div>
              </a>
            </div>
          </div>
        </template>
            </section>
        </div>
    </main>
</template>

<style lang="scss" scoped>
.section-title-tag {
    line-height: 1.1;
    padding-bottom: 4.5rem;
    margin-bottom: 4.5rem;
    border-bottom: .2rem solid #0cf
}

@media screen and (min-width:768px) {
    .section-title-tag {
        padding-bottom: 4.5rem;
        margin-bottom: 4.5rem
    }
}

.not-found {
    padding: 6rem 0
}

.not-found__title {
    font-size: 2.4rem
}

@media screen and (min-width:768px) {
    .not-found__title {
        font-size: 3.6rem
    }
}

.not-found__description {
    font-size: 1.5rem
}

@media screen and (min-width:768px) {
    .not-found__description {
        font-size: 1.8rem
    }
}

@media screen and (min-width:768px) {
    .not-found {
        padding: 12rem 0
    }
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
}

.error-message {
  color: red;
  padding: 20px;
  text-align: center;
  background-color: #ffeeee;
  border-radius: 5px;
  margin-bottom: 20px;
}

.search-section {
  margin-bottom: 40px;
}

.search-section-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #006079;
}

/* Стили для категорий */
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.category-item:hover {
  background-color: #e0e0e0;
}

.category-item i {
  margin-right: 8px;
  color: #006079;
}

/* Стили для статей */
.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-item {
  display: block;
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s;
}

.article-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-image {
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 15px;
}

.article-title {
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: #006079;
}

.article-date {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 10px;
}

.article-excerpt {
  font-size: 1.4rem;
  color: #333;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>