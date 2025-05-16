<script setup lang="ts">
import ModalWindow from '../../../components/ModalWindow.vue';
import Tabs from './Tabs.vue';
import { ref } from 'vue';

// Основные данные продукта
const productData = {
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
  ]
};

// Состояние модального окна (оставляем как в исходнике)
const isModalVisible = ref(false);

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

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
                                <i itemprop="price">{{ productData.price }}</i> <i itemprop="priceCurrency" content="RUB">₽</i>
                                <i class="product__meta__price__current__note">* Цена может отличаться, уточняйте при оформлении заказа</i>
                            </span>
                            <link itemprop="availability" href="https://schema.org/InStock" />
                        </div>
                        <div class="product__meta__availability" :class="{ available: productData.availability }">
                            <i class="fa fa-check"></i>
                            <span>
                                {{ productData.availability ? 'Есть в наличии' : 'Нет в наличии' }}
                            </span>
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
                                <span class="button-wrapper"><button class="button button--blue button--basket">В корзину</button></span>
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
    
    <ModalWindow :is-visible="isModalVisible" @close="closeModal"></ModalWindow>
</article>
</template>