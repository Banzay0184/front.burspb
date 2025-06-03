<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useHead } from '@vueuse/head';
import ModalWindow from '../../../components/ModalWindow.vue';
import Tabs from './Tabs.vue';
import { CartService } from '../../../api/api';

// Интерфейс для данных продукта
interface ProductProps {
  id: number;
  title: string;
  image: string;
  price: string;
  currency: string;
  availability: boolean;
  sku: string;
  weight: string;
  delivery: {
    region: string;
    pickup: string;
  };
  description: string[][];
  tabs: {
    title: string;
    active: boolean;
  }[];
  slug: string;
}

// Получаем данные продукта из пропсов, с возможностью дефолтных значений
const props = withDefaults(defineProps<{
  productData?: ProductProps;
}>(), {
  productData: () => ({
    id: 0,
  title: 'Долото III лопастное Д170 З-88н (Пика)',
  image: 'https://burspb.com/api/files/200.jpg.webp',
  price: '9 800',
  currency: 'RUB',
  availability: true,
  sku: '00262',
  weight: '9 кг',
  delivery: {
    region: 'Сегодня — завтра',
    pickup: 'Сегодня'
  },
  description: [
    ['Долота III лопастные Д170 З-88н (Пика) - это высококачественное оборудование...',
    'Долото Д170 З-88н (Пика) изготовлено из прочных материалов...',
    'Благодаря своим техническим характеристикам...',
    'Долота III лопастные Д170 З-88н (Пика) - это надежное и эффективное решение...'],
    ['Долота III лопастные Д170 З-88н (Пика) - это высококачественное оборудование...',
    'Благодаря своим техническим характеристикам...',
    'Долота III лопастные Д170 З-88н (Пика) - это надежное и эффективное решение...'],
    ['Долота III лопастные Д170 З-88н (Пика) - это высококачественное оборудование...',
    'Долото Д170 З-88н (Пика) изготовлено из прочных материалов...',
    'Благодаря своим техническим характеристикам...',
    'Долота III лопастные Д170 З-88н (Пика) - это надежное и эффективное решение...'],
    ['Долота III лопастные Д170 З-88н (Пика) - это высококачественное оборудование...',
    'Долото Д170 З-88н (Пика) изготовлено из прочных материалов...',
    'Долота III лопастные Д170 З-88н (Пика) - это надежное и эффективное решение...'],
    ['Долота III лопастные Д170 З-88н (Пика) - это высококачественное оборудование...',
    'Долото Д170 З-88н (Пика) изготовлено из прочных материалов...',
    'Благодаря своим техническим характеристикам...'],
  ],
  tabs: [
    { title: 'Описание', active: true },
    { title: 'Как купить', active: false },
    { title: 'Оплата', active: false },
    { title: 'Доставка', active: false },
    { title: 'Гарантия', active: false }
    ],
    slug: 'doloto-III-lopastnoe-d170'
  })
});

    
// Эмиты для событий
const emit = defineEmits(['add-to-cart']);

// Состояние модального окна
const isModalVisible = ref(false);

// Проверяем, есть ли товар в корзине
const isInCart = computed(() => {
  return CartService.isInCart(props.productData.id);
});

// Количество товара в корзине
const itemQuantity = computed(() => {
  return CartService.getItemQuantity(props.productData.id);
});

// Открыть модальное окно
const openModal = () => {
  isModalVisible.value = true;
};



// Закрыть модальное окно
const closeModal = () => {
  isModalVisible.value = false;
};



// Добавить товар в корзину
const addToCart = () => {
  
  if (isInCart.value) {
    // Если товар уже в корзине, увеличиваем количество
    CartService.updateItemQuantity(props.productData.id, itemQuantity.value + 1);
  } else {
    // Если товара еще нет, добавляем его
    CartService.addToCart({
      id: props.productData.id,
      title: props.productData.title,
      price: props.productData.price,
      image: props.productData.image,
      articul: props.productData.sku,
      quantity: 1,
      slug: props.productData.slug,
      availability: props.productData.availability || false,
      weight: props.productData.weight
    });
  }

  emit('add-to-cart');
};


// Уменьшить количество товара
const decreaseQuantity = () => {
  if (itemQuantity.value > 1) {
    CartService.updateItemQuantity(props.productData.id, itemQuantity.value - 1);
  }
};

// Увеличить количество товара
const increaseQuantity = () => {
  CartService.updateItemQuantity(props.productData.id, itemQuantity.value + 1);
};

// Обработчик события изменения корзины
const handleCartChange = () => {
  // Для реактивного обновления компонента
  // В computed свойствах isInCart и itemQuantity уже есть логика получения актуальных данных
};

// Добавляем слушатель события cart-changed при монтировании
onMounted(() => {
  window.addEventListener('cart-changed', handleCartChange);
});

// Удаляем слушатель события при размонтировании
onUnmounted(() => {
  window.removeEventListener('cart-changed', handleCartChange);
});

// Форматирование цены
const formattedPrice = computed(() => {
  const price = props.productData.price;
  if (price === '0 ₽' || price === '0000 ₽') {
    return 'по запросу';
  }
  return price;
});

// Микроразметка Schema.org
const productSchema = computed(() => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": props.productData.title,
  "image": props.productData.image,
  "description": props.productData.description[0].join(' '),
  "sku": props.productData.sku,
  "weight": {
    "@type": "QuantitativeValue",
    "value": parseFloat(props.productData.weight),
    "unitCode": "KGM"
  },
  "offers": {
    "@type": "Offer",
    "price": props.productData.price.replace(/[^\d]/g, ''),
    "priceCurrency": "RUB",
    "availability": props.productData.availability ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "deliveryTime": {
      "@type": "DeliveryTimeSettings",
      "deliveryTime": {
        "@type": "QuantitativeValue",
        "minValue": 1,
        "maxValue": 2,
        "unitCode": "DAY"
      }
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "RUB"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "RU"
      }
    }
  },
  "brand": {
    "@type": "Brand",
    "name": "БурСПб"
  },
  "category": "Буровое оборудование",
  "url": `https://burspb.ru/catalog/${props.productData.slug}`,
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://burspb.ru"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Каталог",
        "item": "https://burspb.ru/catalog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": props.productData.title,
        "item": `https://burspb.ru/catalog/${props.productData.slug}`
      }
    ]
  }
}));

// Обновляем микроразметку при изменении данных продукта
watch(productSchema, (schema) => {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(schema)
      }
    ]
  });
}, { immediate: true });

</script>

<template>
<article itemscope itemtype="http://schema.org/Product" class="product">
    <header class="product__header">
        <h1 itemprop="name" class="product__title product__title--mobile">{{ productData.title }}</h1>
        <div class="row">
            <div class="col product__thumbnail"><img :src="productData.image" itemprop="image" /></div>
            <div class="col product__summary">
                <h3 class="product__title product__title--desktop">{{ productData.title }}</h3>
                <div class="product__summary__row">
                    <div class="product__summary__col">
                        <div itemprop="offers" itemscope itemtype="http://schema.org/Offer" class="product__meta__price">
                            <span class="product__meta__price__current">
                                <i itemprop="price">{{ formattedPrice }}</i>
                                <i v-if="formattedPrice !== 'по запросу'" itemprop="priceCurrency" content="RUB">₽</i>
                                <i class="product__meta__price__current__note">* Цена может отличаться, уточняйте при оформлении заказа</i>
                            </span>
                            <link itemprop="availability" href="https://schema.org/InStock" />
                        </div>
                        <div class="product__meta__availability" 
                        :class="{
                  'available': productData.availability === true,
                }"
                        >
                        <i class="fa" :class="{
                  'fa-check': productData.availability === true,
                  'fa-clock-o': productData.availability === false
                }"></i> 
                <span>{{ 
                  productData.availability === true  ? 'Есть в наличии' : 
                  'Под заказ' 
                }}</span>
                        </div>
                        <div class="product__meta__artikul">
                            <span class="product__meta__artikul__title">Артикул:</span> <span itemprop="sku" class="product__meta__artikul__value">{{ productData.sku }}</span>
                        </div>
                        <div class="product__meta__weight">
                            <span class="product__meta__weight__title">Вес:</span> <span itemprop="weight" class="product__meta__weight__value">{{ productData.weight }}</span>
                        </div>
                    </div>
                    <div class="product__summary__col">
                        <div class="product__meta__delivery">
                            <div class="product__meta__delivery__title">Доставка в ваш регион:</div>
                            <div class="product__meta__delivery__value">{{ productData.delivery.region }}</div>
                        </div>
                        <div class="product__meta__pickup">
                            <div class="product__meta__delivery__title">Самовывоз:</div>
                            <div class="product__meta__delivery__value">{{ productData.delivery.pickup }}</div>
                        </div>
                    </div>
                </div>
                <div class="product__actions">
                    <div class="product__summary__row">
                        <div class="product__summary__col product__summary__col--basket">
                            <div class="product__summary__col--basket--actions">
                                <!-- Показываем разные кнопки в зависимости от того, есть ли товар в корзине -->
                                <span v-if="!isInCart" class="button-wrapper">
                                  <button 
                                    class="button button--blue button--basket"
                                    @click="addToCart"
                                    :disabled="!productData.availability"
                                  >
                                  В корзину
                                </button>
                                </span>
                                <div v-else class="basket__qty product__basket__qty">
                                  <span 
                                    class="basket__qty__action basket__qty__action--minus" 
                                    :class="{ inactive: itemQuantity <= 1 }"
                                    @click="decreaseQuantity"
                                  >-</span>
                                  <span class="product__basket__qty-value">{{ itemQuantity }}</span>
                                  <span 
                                    class="basket__qty__action basket__qty__action--plus"
                                    @click="increaseQuantity"
                                  >+</span>
                                </div>
                            </div>
                        </div>
                        <div class="product__summary__col">
                            <span class="button-wrapper">
                              <button 
                                @click="openModal"
                                class="button button--blue button--outline">Заказать в один клик</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <div class="product__content">
        <Tabs 
          :tabs="productData.tabs" 
          :description="productData.description" 
        />
    </div>
    
    <ModalWindow :is-visible="isModalVisible" @close="closeModal">
        <template #header>
            <h2>Товар добавлен в корзину</h2>
        </template>
        <template #content>
            <p>Товар успешно добавлен в корзину.</p>
        </template>
    </ModalWindow>
</article>
</template>

<style lang="scss" scoped>
.product__basket__qty {
  display: inline-flex;
  align-items: center;
}

.product__basket__qty-value {
  margin: 0 10px;
  min-width: 20px;
  text-align: center;
  font-weight: bold;
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
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  background: #006079;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  cursor: pointer
}

.basket__qty__action:hover {
  background: #0cf
}

.basket__qty__action--minus.inactive {
  cursor: default;
  opacity: 0.5;
}

.basket__qty__action--minus.inactive:hover {
  background: #006079
}

.product__meta__availability.orderable {
  color: #006079;
}

.product__meta__availability.orderable i {
  color: rgb(255, 255, 255);
}

.product__meta__price__current__note {
    display: block;
    font-weight: 400;
    font-size: 1.1rem;
    color: #aaa;
    padding-top: 1.5rem;
}
</style>