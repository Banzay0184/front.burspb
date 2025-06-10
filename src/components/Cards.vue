<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { CartService } from '../api/api'
import { useNotifications } from '../composables/useNotifications'

interface Card {
  id: number
  title: string
  link: string
  image: string
  alt: string
  availability: boolean 
  articul: string
  oldPrice: string
  currentPrice: string
  showOldPrice?: boolean
  slug: string
  views: number
}

interface Offers {
  '@type': string;
  availability: string;
  price: number;
  priceCurrency: string;
  url: string;
  priceValidUntil?: string;
}

const props = defineProps({
  initialCards: {
    type: Array as () => Card[],
    required: true
  },
  additionalCards: {
    type: Array as () => Card[],
    default: () => []
  },
  loadMore: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-to-cart'])

// Инициализация уведомлений
const { showNotificationMessage } = useNotifications();

const cards = ref<Card[]>([...props.initialCards])
const isLoading = ref(false)
const hasMoreCards = ref(props.additionalCards.length > 0)

// Следим за изменением данных от родительского компонента
watch(() => props.initialCards, (newCards) => {
  cards.value = [...newCards];
}, { immediate: true });

// Компонент для микроразметки Schema.org
const ProductSchema = (card: Card) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: card.title,
    image: card.image,
    description: card.alt,
    sku: card.articul,
    mpn: card.articul,
    url: card.link,
    offers: {
      '@type': 'Offer',
      availability: card.availability 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/PreOrder',
      price: parseFloat(card.currentPrice.replace(/[^\d.]/g, '')),
      priceCurrency: 'RUB',
      url: card.link,
      priceValidUntil: card.oldPrice ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
    } as Offers
  }

  return schema
}

// Создаем микроразметку для всех карточек
const cardsSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'itemListElement': cards.value.map((card, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'item': ProductSchema(card)
  }))
}));

// Обновляем микроразметку при изменении карточек
useHead({
  script: computed(() => [
    {
      type: 'application/ld+json',
      children: JSON.stringify(cardsSchema.value)
    }
  ])
});

// Форматирование цены
const formatPrice = (price: string) => {
  if (price === '0 ₽' || price === '0000 ₽') {
    return 'по запросу'
  }
  return price
}

// Метод для добавления товара в корзину
const addToCart = (card: Card) => {
  // Формируем сообщение для уведомления
  const notificationText = !card.availability 
    ? `Товар "${card.title}" добавлен в корзину (под заказ)`
    : `Товар "${card.title}" добавлен в корзину`;
  
  // Показываем уведомление
  showNotificationMessage(notificationText);
  
  emit('add-to-cart', card.id);
}


// Проверяем, есть ли товар в корзине
const isInCart = (id: number): boolean => {
  return CartService.isInCart(id);
}

// Количество товара в корзине
const getItemQuantity = (id: number): number => {
  return CartService.getItemQuantity(id);
}

// Изменение количества товара в корзине
const increaseQuantity = (id: number) => {
  const currentQuantity = CartService.getItemQuantity(id);
  CartService.updateItemQuantity(id, currentQuantity + 1);
}

const decreaseQuantity = (id: number) => {
  const currentQuantity = CartService.getItemQuantity(id);
  
  if (currentQuantity > 1) {
    CartService.updateItemQuantity(id, currentQuantity - 1);
  } else {
    CartService.removeFromCart(id);
  }
}

// Загрузить дополнительные карточки
const loadMoreCards = () => {
  if (!props.loadMore || !hasMoreCards.value) return
  
  isLoading.value = true
  
  // Имитация загрузки с сервера
  setTimeout(() => {
    if (props.additionalCards.length > 0) {
      // Добавляем первые 2 продукта из additionalCards
      const newCards = props.additionalCards.splice(0, 2)
      cards.value.push(...newCards)
      
      // Если больше нет продуктов для загрузки
      if (props.additionalCards.length === 0) {
        hasMoreCards.value = false
      }
    }
    
    isLoading.value = false
  }, 500)
}




// Обновляем карточки при изменении корзины
const handleCartChange = () => {
  // Принудительное обновление для реактивности
  cards.value = [...cards.value];
};

onMounted(() => {
  window.addEventListener('cart-changed', handleCartChange);
});

onUnmounted(() => {
  window.removeEventListener('cart-changed', handleCartChange);
});
</script>

<template>
  <ul class="cards cards--more">
    <li v-for="card in cards" :key="card.id" class="cards__item">
      <div class="card card--card">
        <div class="card__background">
          <img
            :src="card.image" 
            width="350" 
            height="350" 
            :alt="card.alt" 
            loading="lazy" 
          />
        </div>
        <div class="card__inner">
          <h2 itemprop="headline" class="card__title card__title--card">
            <RouterLink :to="card.link">
              {{ card.title }}
            </RouterLink>
          </h2>
          <div class="card__meta">
            <div class="card__meta__row" style="align-items: center;">
              <div 
                class="card__meta__availability" 
                :class="{
                  'available': card.availability === true,
                }"
              >
                <i class="fa" :class="{
                  'fa-check': card.availability === true,
                  'fa-clock-o': card.availability ===  false
                }"></i> 
                <span>{{ 
                  card.availability === true  ? 'Есть в наличии' : 
                  'Под заказ' 
                }}</span>
              </div>
              <div class="card__meta__artikul">
                <span class="card__meta__artikul__title">Артикул:</span> 
                <span class="card__meta__artikul__value">{{ card.articul }}</span>
              </div>
            </div>
          </div>
          <div class="card__price">
            <span v-if="card.showOldPrice || card.oldPrice" class="card__price__old">{{ formatPrice(card.oldPrice) }}</span> 
            <span class="card__price__current">{{ formatPrice(card.currentPrice) }}</span>
          </div>
          <div class="card__actions">
            <div>
              <span class="button-wrapper">
                <RouterLink 
                  :to="card.link" 
                  class="button button--blue button--black"
                >
                  Подробнее
                </RouterLink>
              </span>
            </div>
            <div>
              <span class="button-wrapper">
                <button 
                  v-if="!isInCart(card.id)"
                  @click="addToCart(card)" 
                  class="button button--blue button--bsket"
                  :class="{ 'button--warning': !card.availability }"
                  :title="!card.availability ? 'Товар под заказ - возможны задержки в поставке' : 'Добавить в корзину'"
                >
                  {{ !card.availability ? 'Заказать' : 'В корзину' }}
                </button>
                
                <div v-else class="in-cart-controls">
                  <div class="basket__qty">
                    <span 
                      class="basket__qty__action basket__qty__action--minus" 
                      :class="{ inactive: getItemQuantity(card.id) <= 1 }"
                      @click="decreaseQuantity(card.id)"
                      :title="getItemQuantity(card.id) <= 1 ? 'Удалить товар из корзины' : 'Уменьшить количество'"
                    >-</span>
                    <span class="in-cart-quantity">{{ getItemQuantity(card.id) }}</span>
                    <span 
                      class="basket__qty__action basket__qty__action--plus"
                      @click="increaseQuantity(card.id)"
                    >+</span>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
  <div class="cards--more__action" v-if="loadMore && hasMoreCards">
    <button 
      @click="loadMoreCards" 
      class="button button--blue"
      :disabled="isLoading"
    >
      <span v-if="!isLoading">Загрузить ещё</span>
      <span v-else>Загрузка...</span>
    </button>
  </div>
</template>

<style scoped>
.card__meta__artikul {
    display: flex;
    gap: 2px;
}

.in-cart-controls {
  display: flex;
  justify-content: center;
  align-items: center;
}

.in-cart-quantity {
  margin: 0 5px;
  min-width: 20px;
  text-align: center;
}

.basket__qty {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  line-height: 1
}

.basket__qty__action {
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  background: #006079;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: pointer
}

.basket__qty__action:hover {
  background: #0cf
}

.basket__qty__action--minus.inactive {
  cursor: pointer; /* Разрешаем клики даже на неактивной кнопке */
  opacity: 0.7;
}

.basket__qty__action--minus.inactive:hover {
  background: #0cf;
  opacity: 1;
}

.card__meta__availability.orderable {
  color: #006079;
}

.card__meta__availability.orderable i {
  color: rgb(255, 255, 255);
}

.button--warning {
  background-color: #ff9800 !important;
  border-color: #ff9800 !important;
}

.button--warning:hover {
  background-color: #f57c00 !important;
  border-color: #f57c00 !important;
}
</style>