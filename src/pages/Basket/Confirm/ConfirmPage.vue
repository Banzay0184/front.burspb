<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';
import Breadcrumbs from '../../../components/Breadcrumbs.vue';
import { CartService, getApiUrl } from '../../../api/api';
import PhoneInput from '../../../components/PhoneInput.vue';
import PrivacyCheckbox from '../../../components/PrivacyCheckbox.vue';

// Маршрутизация
const router = useRouter();

// Состояние заказа
const isLoading = ref(false);
const orderSuccess = ref(false);
const errorMessage = ref('');

// Состояние корзины
const cartItems = ref<any[]>([]);

// Тип пользователя
const userType = ref('individual'); // individual, entity, existing
const paymentMethod = ref('cash'); // cash, transfer, card
const deliveryMethod = ref('pickup'); // pickup, delivery

// Состояние формы
const formData = ref({
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  entity_name: '',
  inn: '',
  client_id: ''
});

const privacyAccepted = ref(false);
const privacyError = ref(false);

// Валидация
const isFormValid = computed(() => {
  if (userType.value === 'individual') {
    return formData.value.first_name && 
           formData.value.last_name && 
           formData.value.phone &&
           privacyAccepted.value;
  } else if (userType.value === 'entity') {
    return formData.value.first_name && 
           formData.value.last_name && 
           formData.value.phone && 
           formData.value.entity_name && 
           formData.value.inn &&
           privacyAccepted.value;
  } else if (userType.value === 'existing') {
    return formData.value.client_id && 
           formData.value.phone &&
           privacyAccepted.value;
  }
  return false;
});

// Хлебные крошки
const breadcrumbs = ref([
  { title: 'Главная', url: '/' },
  { title: 'Корзина', url: '/basket' },
  { title: 'Оформление заказа', url: '' }
]);

// Вычисляемые свойства для корзины будут добавлены по мере необходимости

// Загрузка корзины
const loadCart = () => {
  cartItems.value = CartService.getCart();
  
  // Проверяем, что корзина не пустая
  if (cartItems.value.length === 0) {
    router.push('/basket');
  }
};

// Обработчики типа пользователя
const setUserType = (type: string) => {
  userType.value = type;
};

// Обработчики метода оплаты
const setPaymentMethod = (method: string) => {
  paymentMethod.value = method;
};

// Обработчики способа доставки
const setDeliveryMethod = (method: string) => {
  deliveryMethod.value = method;
};

// Отправка заказа
const submitOrder = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Пожалуйста, заполните все обязательные поля';
    if (!privacyAccepted.value) {
      privacyError.value = true;
    }
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  privacyError.value = false;
  
  try {
    // Формируем данные заказа
    const orderItems = cartItems.value.map(item => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      qty: item.quantity,
      meta: {
        artikul: item.articul,
        price: item.price.replace(/\s+/g, '').replace('₽', ''),
        weight: item.weight ? item.weight.replace(/[^\d.,]/g, '').replace(',', '.') : ''
      }
    }));
    
    // Формируем данные запроса
    const orderData = {
      type: userType.value,
      type_submit: 'full',
      payment: paymentMethod.value,
      delivery: deliveryMethod.value,
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      email: formData.value.email,
      phone: formData.value.phone,
      city: formData.value.city,
      address: formData.value.address,
      client_id: formData.value.client_id,
      entity_name: formData.value.entity_name,
      inn: formData.value.inn,
      payment_info: '',
      order: orderItems
    };
    
    // Отправляем запрос
    const response = await fetch(getApiUrl('action/order'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      orderSuccess.value = true;
      // Очищаем корзину
      CartService.clearCart();
      // Показываем успешное сообщение некоторое время, затем перенаправляем
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      throw new Error(data.message || 'Ошибка при оформлении заказа');
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Ошибка при оформлении заказа';
  } finally {
    isLoading.value = false;
  }
};

// Загружаем данные при монтировании
onMounted(() => {
  loadCart();
});

// Создаем микроразметку для страницы оформления заказа
const orderSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'CheckoutPage',
  'name': 'Оформление заказа',
  'description': 'Страница оформления заказа в интернет-магазине оборудования для бурения',
  'mainEntity': {
    '@type': 'Order',
    'orderStatus': orderSuccess.value ? 'OrderDelivered' : 'OrderProcessing',
    'orderedItem': cartItems.value.map(item => ({
      '@type': 'OrderItem',
      'name': item.title,
      'sku': item.articul,
      'price': item.price.replace(/\s+/g, '').replace('₽', ''),
      'quantity': item.quantity,
      'image': item.image
    })),
    'customer': {
      '@type': userType.value === 'entity' ? 'Organization' : 'Person',
      'name': userType.value === 'entity' ? formData.value.entity_name : `${formData.value.first_name} ${formData.value.last_name}`,
      'telephone': formData.value.phone,
      'email': formData.value.email,
      ...(userType.value === 'entity' && { 'taxID': formData.value.inn })
    },
    'paymentMethod': {
      '@type': 'PaymentMethod',
      'name': paymentMethod.value === 'cash' ? 'Наличные' : 
              paymentMethod.value === 'transfer' ? 'Безналичный перевод' : 'Банковская карта'
    },
    'deliveryMethod': {
      '@type': 'DeliveryMethod',
      'name': deliveryMethod.value === 'pickup' ? 'Самовывоз' : 'Транспортная компания'
    }
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(orderSchema.value)
    }
  ]
});
</script>

<template>
  <main class="main">
    <div class="wrapper">
      <Breadcrumbs :items="breadcrumbs" />

      <article class="post">
        <header>
          <h1 class="title post__title">Оформление заказа</h1>
        </header>
        
        <!-- Сообщение об успешном оформлении заказа -->
        <section v-if="orderSuccess" class="content post__content">
          <div class="order-success">
            <h3>Спасибо за ваш заказ!</h3>
            <p>Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время.</p>
            <p>Вы будете перенаправлены на главную страницу через несколько секунд...</p>
          </div>
        </section>
        
        <!-- Форма оформления заказа -->
        <section v-else class="content post__content">
          <!-- Товары в корзине -->
          <table class="basket__list basket__list--inactive">
            <tbody>
              <tr v-for="item in cartItems" :key="item.id" class="basket__list__item">
                <td class="basket__list__item__cell basket__list__item__cell--thumb">
                  <span :style="`background-image: url('${item.image}');`"></span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--title">
                  <a :href="`/catalog/product-${item.slug}`">
                    {{ item.title }}
                  </a>
                  <span class="basket__list__item__cell--title-price">
                    Цена за ед. {{ item.price }}
                  </span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--artikul">
                  <span class="basket__list__item__cell__title">Артикул:</span> 
                  <span>{{ item.articul }}</span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--weight">
                  <span class="basket__list__item__cell__title" v-if="item.weight"> Вес:</span> 
                  <span>{{ item.weight }}</span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--qty"></td>
                <td class="basket__list__item__cell basket__list__item__cell--price">
                  <span>{{ item.quantity }} x {{ item.price }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Сообщение об ошибке -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <!-- Форма заказа -->
          <div class="basket__submit">
            <div class="row">
              <form class="form" @submit.prevent="submitOrder">
                <div class="basket__submit__before">
                  <div class="form__row form__row--checkbox form__row--property">
                    <div class="checkbox checkbox--onwhite" @click="setUserType('individual')">
                      <span class="checkbox__check" :class="{ checked: userType === 'individual' }">
                        <span class="checkbox__check__icon">✓</span>
                      </span>
                      <span class="checkbox__title">Физическое лицо</span>
                    </div>
                    <div class="checkbox checkbox--onwhite" @click="setUserType('entity')">
                      <span class="checkbox__check" :class="{ checked: userType === 'entity' }">
                        <span class="checkbox__check__icon">✓</span>
                      </span>
                      <span class="checkbox__title">Юридическое лицо</span>
                    </div>
                    <div class="checkbox checkbox--onwhite" @click="setUserType('existing')">
                      <span class="checkbox__check" :class="{ checked: userType === 'existing' }">
                        <span class="checkbox__check__icon">✓</span>
                      </span>
                      <span class="checkbox__title">Существующий клиент</span>
                    </div>
                  </div>
                </div>
                
                <div class="basket__submit__inner" :class="{ 'isClient': userType === 'existing' }">
                  <div class="basket__submit__inner__cols">
                    <!-- Левая колонка - данные покупателя -->
                    <div class="basket__submit__inner__col basket__submit__inner__col--left">
                      <div class="form__row__before">Контактное лицо</div>
                      
                      <!-- Поля для физического и юридического лица -->
                      <template v-if="userType !== 'existing'">
                        <div class="form__row">
                          <label for="first_name" class="label">
                            Имя <span class="required">*</span>
                          </label>
                          <input 
                            type="text" 
                            id="first_name" 
                            name="first_name" 
                            class="input" 
                            v-model="formData.first_name" 
                            required
                          >
                        </div>
                        <div class="form__row">
                          <label for="last_name" class="label">
                            Фамилия <span class="required">*</span>
                          </label>
                          <input 
                            type="text" 
                            id="last_name" 
                            name="last_name" 
                            class="input" 
                            v-model="formData.last_name" 
                            required
                          >
                        </div>
                        <div class="form__row">
                          <label for="phone" class="label">
                            Телефон <span class="required">*</span>
                          </label>
                          <PhoneInput 
                            id="phone" 
                            name="phone" 
                            v-model="formData.phone" 
                            required
                          />
                        </div>
                        <div class="form__row">
                          <label for="email" class="label">
                            Почта
                          </label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            class="input" 
                            v-model="formData.email"
                          >
                        </div>
                        
                        <!-- Дополнительные поля для юридического лица -->
                        <template v-if="userType === 'entity'">
                          <div class="form__row">
                            <label for="entity_name" class="label">
                              Название организации <span class="required">*</span>
                            </label>
                            <input 
                              type="text" 
                              id="entity_name" 
                              name="entity_name" 
                              class="input" 
                              v-model="formData.entity_name" 
                              required
                            >
                          </div>
                          <div class="form__row">
                            <label for="inn" class="label">
                              ИНН <span class="required">*</span>
                            </label>
                            <input 
                              type="text" 
                              id="inn" 
                              name="inn" 
                              class="input" 
                              v-model="formData.inn" 
                              required
                            >
                          </div>
                        </template>
                      </template>
                      
                      <!-- Поля для существующего клиента -->
                      <template v-else>
                        <div class="form__row">
                          <label for="client_id" class="label">
                            ID клиента <span class="required">*</span>
                          </label>
                          <input 
                            type="text" 
                            id="client_id" 
                            name="client_id" 
                            class="input" 
                            v-model="formData.client_id" 
                            required
                          >
                        </div>
                        <div class="form__row">
                          <label for="phone" class="label">
                            Телефон <span class="required">*</span>
                          </label>
                          <PhoneInput 
                            id="phone" 
                            name="phone" 
                            v-model="formData.phone" 
                            required
                          />
                        </div>
                      </template>
                    </div>
                    
                    <!-- Правая колонка - способы оплаты и доставки -->
                    <div class="basket__submit__inner__col basket__submit__inner__col--right">
                      <div class="basket__submit__inner__checkboxes">
                        <div class="basket__submit__inner__checkboxes__col basket__submit__inner__checkboxes__col--left">
                          <div class="form__row__before">Способ оплаты</div>
                          <div class="form__row form__row--checkbox">
                            <div class="checkbox" @click="setPaymentMethod('cash')">
                              <span class="checkbox__check" :class="{ checked: paymentMethod === 'cash' }">
                                <span class="checkbox__check__icon">✓</span>
                              </span>
                              <span class="checkbox__title">Наличными</span>
                            </div>
                            <div class="checkbox" @click="setPaymentMethod('transfer')">
                              <span class="checkbox__check" :class="{ checked: paymentMethod === 'transfer' }">
                                <span class="checkbox__check__icon">✓</span>
                              </span>
                              <span class="checkbox__title">Безналичный перевод</span>
                            </div>
                            <div class="checkbox" @click="setPaymentMethod('card')">
                              <span class="checkbox__check" :class="{ checked: paymentMethod === 'card' }">
                                <span class="checkbox__check__icon">✓</span>
                              </span>
                              <span class="checkbox__title">Банковской картой</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="basket__submit__inner__checkboxes__col basket__submit__inner__checkboxes__col--right">
                          <div class="form__row__before">Доставка</div>
                          <div class="form__row form__row--checkbox">
                            <div class="checkbox" @click="setDeliveryMethod('pickup')">
                              <span class="checkbox__check" :class="{ checked: deliveryMethod === 'pickup' }">
                                <span class="checkbox__check__icon">✓</span>
                              </span>
                              <span class="checkbox__title">Самовывоз</span>
                            </div>
                            <div class="checkbox" @click="setDeliveryMethod('delivery')">
                              <span class="checkbox__check" :class="{ checked: deliveryMethod === 'delivery' }">
                                <span class="checkbox__check__icon">✓</span>
                              </span>
                              <span class="checkbox__title">Транспортная компания</span>
                            </div>
                          </div>
                          
                          <!-- Дополнительные поля для доставки -->
                          <template v-if="deliveryMethod === 'delivery'">
                            <div class="form__row">
                              <label for="city" class="label">
                                Город <span class="required">*</span>
                              </label>
                              <input 
                                type="text" 
                                id="city" 
                                name="city" 
                                class="input" 
                                v-model="formData.city" 
                                required
                              >
                            </div>
                            <div class="form__row">
                              <label for="address" class="label">
                                Адрес <span class="required">*</span>
                              </label>
                              <input 
                                type="text" 
                                id="address" 
                                name="address" 
                                class="input" 
                                v-model="formData.address" 
                                required
                              >
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <PrivacyCheckbox
                    v-model="privacyAccepted"
                    :error="privacyError"
                  />
                </div>
                
                <!-- Кнопка отправки формы -->
                <div class="form__row form__row--action">
                  <button 
                    type="submit" 
                    class="button button--blue button--outline" 
                    :disabled="isLoading"
                  >
                    {{ isLoading ? 'Отправка...' : 'Оформить заказ' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.basket__submit__inner {
  position: relative;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 3rem;
  background: linear-gradient(223.06deg, #0cf 3.37%, #006079 100.96%);
  color: #fff
}

@media screen and (min-width:480px) {
  .basket__submit__inner {
    padding: 2.25rem
  }

  .basket__submit__inner__checkboxes {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap
  }

  .basket__submit__inner__checkboxes__col {
    width: calc(50% - 1.5rem)
  }
}

@media screen and (min-width:768px) {
  .basket__submit__inner {
    padding: 3rem
  }
}

.basket__submit .form__row--checkbox {
  display: block;
  margin-bottom: 3rem
}

.basket__submit .form__row--checkbox .checkbox {
  margin-bottom: 1.5rem;
  cursor: pointer;
}

@media screen and (min-width:768px) {
  .basket__submit .form__row--checkbox {
    margin-bottom: 1.5rem
  }
}

.basket__submit .form__row--property {
  display: block;
  padding-left: 10vw;
  padding-right: 10vw;
  margin-bottom: 3rem
}

.basket__submit .form__row--property .checkbox {
  margin-bottom: 1.5rem;
  cursor: pointer;
}

@media screen and (min-width:768px) {
  .basket__submit .form__row--property {
    padding-left: 0;
    padding-right: 0
  }
}

.basket__submit .form__row--action {
  text-align: center
}

@media screen and (min-width:768px) {
  .basket__submit .form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap
  }

  .basket__submit__before {
    width: 25rem
  }

  .basket__submit__inner {
    width: calc(100% - 28rem)
  }

  .basket__submit__inner__checkboxes__col .form__row {
    margin-bottom: 1.5rem
  }

  .basket__submit__inner__checkboxes__col.ent .form__row {
    margin-bottom: 2.25rem
  }
}

@media screen and (min-width:1024px) {
  .basket__submit__before {
    width: 25rem
  }

  .basket__submit__inner {
    width: calc(100% - 28rem)
  }

  .basket__submit__inner__cols {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap
  }

  .basket__submit__inner__col {
    width: calc(50% - 3rem)
  }

  .basket__submit__inner__checkboxes {
    display: block
  }

  .basket__submit__inner__checkboxes__col {
    width: 100%
  }

  .basket__submit__inner__checkboxes .checkbox {
    margin-bottom: .75rem !important
  }

  .basket__submit__inner__checkboxes .checkbox__title {
    font-size: 1.4rem
  }
}

@media screen and (min-width:1200px) {
  .basket__submit {
    padding-left: 5vw;
    padding-right: 5vw
  }
}

.basket__submit__inner.isClient .basket__submit__inner__col--left {
  display: none
}

.basket__submit__inner.isClient .basket__submit__inner__col--right {
  margin-left: auto;
  margin-right: auto
}

.basket__submit__inner.isClient .label {
  font-weight: 600
}

@media screen and (min-width:1024px) {
  .basket__submit__inner.isClient {
    flex-basis: 400px;
    margin-left: auto;
    margin-right: auto
  }

  .basket__submit__inner.isClient .basket__submit__inner__col--right {
    width: 100%
  }

  .basket__submit__inner.isClient .basket__submit__inner__checkboxes__col .form__row {
    margin-bottom: 3rem
  }

  .basket__submit__inner.isClient .basket__submit__inner__checkboxes__col.ent .form__row {
    margin-bottom: 2.25rem
  }
}

.required {
  color: #ff5252;
}

.error-message {
  background-color: #ffeded;
  color: #ff5252;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
}

.order-success {
  text-align: center;
  padding: 5rem 0;
}

.order-success h3 {
  color: #006079;
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
}

.order-success p {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.checkbox {
  cursor: pointer;
}
</style>