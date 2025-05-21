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
import { CartService } from '../api/api';

// Состояние компонента для карточек товаров
const cardsList = ref<any[]>([]);
const cardsListAdditional = ref<any[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Состояние уведомления
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationTimeout = ref<number | null>(null);

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
        showOldPrice: !!product.meta.price_old,
        slug: product.slug,
        quantity: 1,
        weight: product.meta.weight ? `${product.meta.weight} кг` : ''
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
          showOldPrice: !!product.meta.price_old,
          slug: product.slug,
          quantity: 1,
          weight: product.meta.weight ? `${product.meta.weight} кг` : ''
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

// Функция показа уведомления
const showNotificationMessage = (message: string) => {
  // Очищаем предыдущий таймер, если он существует
  if (notificationTimeout.value) {
    clearTimeout(notificationTimeout.value);
  }
  
  // Устанавливаем сообщение и показываем уведомление
  notificationMessage.value = message;
  showNotification.value = true;
  
  // Скрываем уведомление через 3 секунды
  notificationTimeout.value = setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const addToCart = (id: number) => {
  // Находим товар в списке
  const product = [...cardsList.value, ...cardsListAdditional.value].find(item => item.id === id);
  
  if (product) {
    // Проверяем, уже есть ли товар в корзине
    if (CartService.isInCart(id)) {
      // Если товар уже в корзине, увеличиваем количество
      const currentQuantity = CartService.getItemQuantity(id);
      CartService.updateItemQuantity(id, currentQuantity + 1);
      showNotificationMessage(`Количество товара "${product.title}" увеличено (${currentQuantity + 1} шт.)`);
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
        available: product.available !== false,
        weight: product.weight || ''
      });
      showNotificationMessage(`Товар "${product.title}" добавлен в корзину`);
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