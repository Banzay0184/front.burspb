<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHead } from '@vueuse/head';
import Benefits from '../components/Benefits.vue';
import Cover from '../components/Cover.vue';
import Gratitude from '../components/Gratitude.vue';
import Oes from '../components/Oes.vue';
import Partnership from '../components/Partnership.vue';
import Popular from '../components/Popular.vue';
import RecentPosts from '../components/RecentPosts.vue';
import Cards from '../components/Cards.vue';
import { CartService } from '../api/api';
import { getApiUrl } from '../api/api';
import { useNotifications } from '../composables/useNotifications';

// Инициализация уведомлений
const { showNotification, notificationMessage, showNotificationMessage } = useNotifications();

// SEO мета-теги для главной страницы управляются через SSG конфигурацию
// Не вызываем useSeo() чтобы не перезаписывать мета-теги из SSG

// Состояние компонента для карточек товаров
const cardsList = ref<any[]>([]);
const cardsListAdditional = ref<any[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Получаем предварительно загруженные данные из SSG initialState
const getInitialData = () => {
  if (typeof window !== 'undefined' && (window as any).__INITIAL_STATE__) {
    try {
      // Если данные в виде строки JSON, парсим их
      let initialState = (window as any).__INITIAL_STATE__;
      if (typeof initialState === 'string') {
        initialState = JSON.parse(initialState);
      }
      return initialState.popularProducts || [];
    } catch (err) {
      // Тихо обрабатываем ошибку парсинга
      return [];
    }
  }
  return [];
};

// Микроразметка Schema.org
const websiteSchema = computed(() => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Burspb",
  "url": "https://burspb.ru",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://burspb.ru/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}));

const productsSchema = computed(() => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": cardsList.value.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": item.title,
      "image": item.image,
      "description": item.alt,
      "sku": item.articul,
      "offers": {
        "@type": "Offer",
        "price": item.currentPrice.replace(/[^\d]/g, ''),
        "priceCurrency": "RUB",
        "availability": item.availability ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      }
    }
  }))
}));

// Обновляем микроразметку при изменении данных
useHead({
  script: computed(() => [
    {
      type: 'application/ld+json',
      children: JSON.stringify(websiteSchema.value)
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify(productsSchema.value)
    }
  ])
});

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
  quantity: 1,
  weight: product.meta?.weight ? `${product.meta.weight} кг` : ''
});

// Функция для запроса популярных продуктов с API
const fetchPopularProducts = async () => {
  error.value = null;
  
  try {
    // Сначала пытаемся использовать предварительно загруженные данные
    const initialData = getInitialData();
    
    if (initialData.length > 0) {
      // Используем предварительно загруженные данные
      cardsList.value = initialData.slice(0, 4).map(transformProduct);
      
      if (initialData.length > 4) {
        cardsListAdditional.value = initialData.slice(4).map(transformProduct);
      }
      
      isLoading.value = false;
      return;
    }
    
    // Если предварительно загруженных данных нет, делаем API запрос
    isLoading.value = true;
    
    const params = new URLSearchParams({
      sort: 'popularity-desc',
      per_page: '8'
    });
    
    const response = await fetch(getApiUrl(`products/?${params.toString()}`));
    
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.posts && data.posts.length > 0) {
      cardsList.value = data.posts.slice(0, 4).map(transformProduct);
      
      if (data.posts.length > 4) {
        cardsListAdditional.value = data.posts.slice(4).map(transformProduct);
      }
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
          // Тихо обрабатываем ошибку загрузки
  } finally {
    isLoading.value = false;
  }
};

const addToCart = (id: number) => {
  // Находим товар в списке
  const product = [...cardsList.value, ...cardsListAdditional.value].find(item => item.id === id);
  
  if (product) {
    // Проверяем доступность товара и выводим соответствующее уведомление
    if (!product.availability) {
      // Товар под заказ - уведомление обрабатывается в UI
    }

    // Проверяем, уже есть ли товар в корзине
    if (CartService.isInCart(id)) {
      // Если товар уже в корзине, увеличиваем количество
      const currentQuantity = CartService.getItemQuantity(id);
      CartService.updateItemQuantity(id, currentQuantity + 1);
      const notificationText = !product.availability 
        ? `Количество товара "${product.title}" увеличено (${currentQuantity + 1} шт.) - товар под заказ`
        : `Количество товара "${product.title}" увеличено (${currentQuantity + 1} шт.)`;
      showNotificationMessage(notificationText);
    } else {
      // Добавляем новый товар в корзину
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
      const notificationText = !product.availability 
        ? `Товар "${product.title}" добавлен в корзину (под заказ)`
        : `Товар "${product.title}" добавлен в корзину`;
      showNotificationMessage(notificationText);
    }
  }
};

// Загружаем данные при монтировании компонента
onMounted(() => {
  fetchPopularProducts();
});
</script>


<template>
<main class="main main--index">
    <!-- SEO заголовок для главной страницы -->
    <div class="wrapper">
        <section class="hero-section">
            <h1 class="hero-title visually-hidden-but-seo">
                Буровые установки, оборудование и инструмент
            </h1>
        </section>
    </div>
    
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
    
    <!-- Уведомление о добавлении в корзину -->
    <div class="notification" :class="{ 'notification--show': showNotification }">
      <div class="notification__content">
        <div class="notification__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <div class="notification__message">
          {{ notificationMessage }}
        </div>
      </div>
    </div>
</main>
</template>

<style lang="scss" scoped>
/* SEO заголовок - скрыт визуально, но виден для поисковиков */
.hero-section {
  position: relative;
  margin-bottom: 1rem;
}

.hero-title.visually-hidden-but-seo {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  
  /* Обеспечиваем доступность для screen readers */
  &:focus {
    position: static;
    width: auto;
    height: auto;
    padding: 0.5rem;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
    background: #f0f0f0;
    border: 1px solid #ccc;
    font-size: 1.2rem;
    text-align: center;
  }
}

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

/* Стили для уведомления */
.notification {
  position: fixed;
  bottom: -100px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  transition: bottom 0.3s ease-in-out;
  z-index: 1000;
}

.notification--show {
  bottom: 20px;
}

.notification__content {
  background: linear-gradient(223.06deg, #0cf 3.37%, #006079 100.96%);
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  max-width: 80%;
}

.notification__icon {
  margin-right: 15px;
}

.notification__message {
  font-size: 16px;
}
</style>