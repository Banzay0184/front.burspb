<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { CartService } from '../../api/api';
import Breadcrumbs from '../../components/Breadcrumbs.vue';

// Состояние корзины
const cartItems = ref<any[]>([]);
const isLoading = ref(true);

// Хлебные крошки
const breadcrumbs = ref([
  { title: 'Корзина', url: '' }
]);

// Загрузка данных корзины
const loadCart = () => {

  isLoading.value = true;
  cartItems.value = CartService.getCart();
  isLoading.value = false;
};

// Вычисляемые свойства
const isCartEmpty = computed(() => cartItems.value.length === 0);
const cartTotal = computed(() => {
  const total = cartItems.value.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/\s+/g, '').replace('₽', ''));
    return sum + (price * item.quantity);
  }, 0);
  return total.toLocaleString('ru-RU');
});
const cartWeight = computed(() => {
  // Вычисляем общий вес товаров в корзине (если данные о весе есть)
  let totalWeight = 0;
  cartItems.value.forEach(item => {
    if (item.weight) {
      // Предполагаем, что вес может быть указан в формате "9 кг"
      const weightValue = parseFloat(item.weight.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (!isNaN(weightValue)) {
        totalWeight += weightValue * item.quantity;
      }
    }
  });
  return totalWeight.toFixed(2);
});

// Форматирование цены
const formatPrice = (price: string) => {
  if (price === '0 ₽' || price === '0000 ₽') {
    return 'по запросу'
  }
  return price
}

// Получение цены товара
const getItemPrice = (item: any) => {
  return formatPrice(item.price)
}

// Функция для получения общей цены товара
const getItemTotalPrice = (item: any) => {
  const price = parseFloat(item.price.replace(/\s+/g, '').replace('₽', ''));
  return (price * item.quantity).toLocaleString('ru-RU');
};

// Обработчики событий
const handleQuantityChange = (id: number, quantity: number) => {
  const cart = CartService.getCart();
  const itemIndex = cart.findIndex(item => item.id === id);
  
  if (itemIndex !== -1) {
    cart[itemIndex].quantity = Math.max(1, quantity);
    localStorage.setItem('burspb_cart', JSON.stringify(cart));
    cartItems.value = cart; // Немедленно обновляем состояние
    window.dispatchEvent(new CustomEvent('cart-changed'));
  }
};

const increaseQuantity = (id: number) => {
  const item = cartItems.value.find(item => item.id === id);
  if (item) {
    handleQuantityChange(id, item.quantity + 1);
  }
};

const decreaseQuantity = (id: number) => {
  const item = cartItems.value.find(item => item.id === id);
  if (item && item.quantity > 1) {
    handleQuantityChange(id, item.quantity - 1);
  }
};

const removeItem = (id: number) => {
  CartService.removeFromCart(id);
  loadCart();
};

// Функция очистки корзины (используется в разработке)
// const clearCart = () => {
//   CartService.clearCart();
//   loadCart();
// };

// Инициализация
onMounted(() => {
  loadCart();
  // Слушаем событие изменения корзины
  window.addEventListener('cart-changed', loadCart);
});

// Очистка слушателей при размонтировании
onUnmounted(() => {
  window.removeEventListener('cart-changed', loadCart);
});
</script>

<template>
  <main class="main">
    <div class="wrapper">
      <Breadcrumbs :items="breadcrumbs" />
      
      <!-- Показываем содержимое корзины, если в ней есть товары -->
      <article v-if="!isCartEmpty" class="post">
        <header>
          <h1 class="title post__title">Корзина</h1>
        </header>
        <section class="content post__content">
          <table class="basket__list">
            <tbody>
              <tr v-for="item in cartItems" :key="item.id" class="basket__list__item">
                <td class="basket__list__item__cell basket__list__item__cell--thumb">
                  <span :style="`background-image: url('${item.image}');`"></span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--title">
                  <RouterLink :to="`/catalog/product-${item.slug}`" style="color: #006079; text-decoration: underline">
                    {{ item.title }}
                  </RouterLink>
                  <span class="basket__list__item__cell--title-price">
                    Цена за ед. <span>{{ getItemPrice(item) }}</span>
                  </span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--artikul">
                  <span class="basket__list__item__cell__title">Артикул:</span>
                  <span>{{ item.articul }}</span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--weight">
                  <span v-if="item.weight">Вес: {{ item.weight }}</span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--qty">
                  <div class="basket__qty">
                    <span 
                      class="basket__qty__action basket__qty__action--minus" 
                      :class="{ inactive: item.quantity <= 1 }"
                      @click="decreaseQuantity(item.id)"
                    >-</span>
                    <input 
                      type="number" 
                      min="1" 
                      class="input-number input-number--basket__qty"
                      :value="item.quantity"
                      @change="(e) => handleQuantityChange(item.id, parseInt((e.target as HTMLInputElement).value, 10))"
                    >
                    <span 
                      class="basket__qty__action basket__qty__action--plus"
                      @click="increaseQuantity(item.id)"
                    >+</span>
                  </div>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--price">
                  <span>{{ getItemTotalPrice(item) }} ₽</span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--delete">
                  <button 
                    class="basket__list__item__cell__action basket__list__item__cell__action--delete"
                    @click="removeItem(item.id)"
                  >x</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="basket__summary">
            <div class="row">
              <div class="col col--left">
                <div>
                  <span class="basket__summary__title">Итого:</span>
                  <span class="basket__summary__value">{{ cartTotal }} ₽</span>
                </div>
                <div>
                  <span class="basket__summary__title">Вес:</span>
                  <span class="basket__summary__value">{{ cartWeight }} кг</span>
                </div>
              </div>
              <div class="col col--right">
                <div>
                  <span class="button-wrapper">
                    <RouterLink to="/catalog" class="button button--blue button--outline">
                      Продолжить покупки
                    </RouterLink>
                  </span>
                </div>
                <div>
                  <span class="button-wrapper">
                    <RouterLink to="/basket/confirm" class="button button--blue button--blue">
                      Оформить заказ
                    </RouterLink>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
      
      <!-- Показываем сообщение о пустой корзине, если в ней нет товаров -->
      <article v-else class="post">
        <header>
          <h1 class="title post__title">Корзина</h1>
        </header>
        <section class="content post__content">
          <div>
            <h3>Ваша корзина пуста</h3>
            <p>Выберите нужные позиции из каталога продукции и добавьте их в корзину</p>
            <div class="empty-basket-action">
              <span class="button-wrapper">
                <RouterLink to="/catalog" class="button button--blue button--outline">
                  В каталог →
                </RouterLink>
              </span>
            </div>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>

<style lang="scss" scoped>

.empty-basket-action .button {
  width: auto;
  padding-left: 3rem;
  padding-right: 3rem;
  max-width: 30rem;
}

a.button {
  width: fit-content;
  text-decoration: none
}

a.button--blue {
  color: #fff
}

a.button--blue.button--outline {
  color: #006079
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
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 50%;
  background: #006079;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer
}

.basket__qty__action:hover {
  background: #0cf
}

.basket__qty__action--minus {
  margin-right: .25rem
}

.basket__qty__action--minus.inactive {
  cursor: default;
  opacity: 0.5;
}

.basket__qty__action--minus.inactive:hover {
  background: #006079
}

.product__header .basket__qty__action--minus {
  margin-right: 1rem
}

.basket__qty__action--plus {
  margin-left: .25rem
}

.product__header .basket__qty__action--plus {
  margin-left: 1rem
}

.input-number--basket__qty {
  width: 40px;
  text-align: center;
}

@media screen and (min-width:1280px) {
  .basket__qty__action--minus {
    margin-right: 1rem
  }

  .basket__qty__action--plus {
    margin-left: 1rem
  }
}
</style>