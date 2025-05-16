<script setup lang="ts">
import { ref } from 'vue'

interface Card {
  id: number
  title: string
  link: string
  image: string
  alt: string
  available: boolean
  articul: string
  oldPrice: string
  currentPrice: string
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

const emit = defineEmits(['addToCart'])

const cards = ref<Card[]>([...props.initialCards])
const isLoading = ref(false)
const hasMoreCards = ref(props.additionalCards.length > 0)

const addToCart = (cardId: number) => {
  emit('addToCart', cardId)
}

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
          <RouterLink :to="card.link">
            <h2 itemprop="headline" class="card__title card__title--card">
              {{ card.title }}
            </h2>
          </RouterLink>
          <div class="card__meta">
            <div class="card__meta__row" style="align-items: center;">
              <div 
                class="card__meta__availability" 
                :class="{ 'available': card.available, 'unavailable': !card.available }"
              >
                <i class="fa" :class="card.available ? 'fa-check' : 'fa-times'"></i> 
                <span>{{ card.available ? 'Есть в наличии' : 'Нет в наличии' }}</span>
              </div>
              <div class="card__meta__artikul">
                <span class="card__meta__artikul__title">Артикул:</span> 
                <span class="card__meta__artikul__value">{{ card.articul }}</span>
              </div>
            </div>
          </div>
          <div class="card__price">
            <span class="card__price__old">{{ card.oldPrice }}</span> 
            <span class="card__price__current">{{ card.currentPrice }}</span>
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
                  @click="addToCart(card.id)" 
                  class="button button--blue button--basket"
                  :disabled="!card.available"
                >
                  В корзину
                </button>
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
</style>