<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import apiService from '../api/api';
import { CartService } from '../api/api';

interface CategoryItem {
  href: string;
  iconSrc: string;
  iconAlt: string;
  title: string;
  isBasket?: boolean;
}

const categories = ref<CategoryItem[]>([]);
const cartItemsCount = ref(0);

const getIconPath = (iconClass: string) => {
  // Карта соответствия классов иконок и путей к изображениям
  const iconMap: Record<string, string> = {
    'icon-cat-1': '/image/0638dd.svg', // Буровые установки
    'icon-cat-2': '/image/0cbb3c.svg', // Инструмент для шарошечного бурения
    'icon-cat-3': '/image/8cf2d3.svg', // Инструмент для вращательного бурения
    'icon-cat-4': '/image/b4113b.svg', // Интрумент для шнекового бурения
    'icon-cat-5': '/image/f17657.svg', // Инструмент для колонкового бурения
    'icon-cat-6': '/image/c0fc52.svg', // Инструмент для пневмоударного бурения
    'icon-cat-7': '/image/919b76.svg', // Обустройство скважин
    'icon-cat-8': '/image/c2e082.svg', // Аварийный инструмент
    'icon-cat-9': '/image/f7e482.svg', // Вспомогательный инструмент
    'icon-cat-11': '/image/4138f1.svg', // Буровые долота, трубы, прочее
    'icon-cat-12': '/image/8197a9.svg', // Запасные части
    'icon-cat-13': '/image/a19cb7.svg', // Буровые насосы
    'icon-basket': '/image/d1bbbc.svg' // Корзина
  };
  
  return iconMap[iconClass] || '/image/4138f1.svg'; // Значение по умолчанию
};

const updateCartCount = () => {
  cartItemsCount.value = CartService.getCartItemsCount();
};

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    if (response.data && response.data.navigation && response.data.navigation.categories) {
      const apiCategories = response.data.navigation.categories;
      
      // Преобразуем данные API в формат, ожидаемый компонентом
      categories.value = apiCategories.map((item: any) => ({
        href: `/catalog/selection-${item.slug}`,
        iconSrc: getIconPath(item.icon),
        iconAlt: `Перейти к ${item.title}`,
        title: item.title,
        isBasket: false
      }));
      
      // Добавляем корзину в конец списка
      categories.value.push({
        href: '/Basket/BasketPage',
        iconSrc: getIconPath('icon-basket'),
        iconAlt: 'Перейти в корзину',
        title: 'Корзина',
        isBasket: true
      });
    }
  } catch (error) {
  }
};

const handleCartChange = () => {
  updateCartCount();
};

onMounted(() => {
  fetchGlobalData();
  updateCartCount();
  window.addEventListener('cart-changed', handleCartChange);
});

onUnmounted(() => {
  window.removeEventListener('cart-changed', handleCartChange);
});
</script>

<template>
  <nav class="categories categories--header">
    <ul itemtype="http://schema.org/SiteNavigationElement">
      <li 
        v-for="(item, index) in categories"
        :key="index" 
        class="categories__item"
      >
        <RouterLink 
          :to="item.href" 
          itemprop="url"
          custom
          v-slot="{ navigate, href }"
        > 
          <a 
            :href="href" 
            @click="navigate"
          >
            <span 
              :class="{
                'categories__item__icon': true,
                'categories__item__basket': item.isBasket
              }"
            >
              <img 
                :src="item.iconSrc" 
                width="92" 
                height="92" 
                :alt="item.iconAlt" 
                loading="lazy" 
              />

              <!-- Показ количества товаров в корзине -->
              <span 
                v-if="item.isBasket && cartItemsCount > 0" 
                class="categories__item__icon__basket__value"
              >
                {{ cartItemsCount }}
              </span>
            </span>
             
            <span class="categories__item__title">{{ item.title }}</span>
          </a>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.categories__item__icon__basket__value {
  position: absolute;
  top: 30px;
  right: -5px;
  background-color: #f00;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
}

.categories__item__basket {
  position: relative;
}
</style>