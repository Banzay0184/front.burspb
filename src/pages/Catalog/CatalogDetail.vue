<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';
import Product from './components/Product.vue';
import Cards from '../../components/Cards.vue';
import { CartService, getApiUrl } from '../../api/api';

// Получаем параметры маршрута
const route = useRoute();
const productSlug = computed(() => route.params.slug?.toString() || '');

// Состояние для данных продукта
const productData = ref<any>(null);
const similarProducts = ref<any[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const breadcrumbs = ref<any[]>([]);

// Загрузка данных о продукте из API
const fetchProductData = async () => {
  if (!productSlug.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    // Запрос данных о продукте
    const response = await fetch(getApiUrl(`product/slug/${productSlug.value}`));
    
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Формируем данные продукта в нужном формате
    const product = data.product || data;
    
    productData.value = {
      id: product.id,
      title: product.title || '',
      image: product.img?.webp_full || product.img?.full || '',
      price: product.meta?.price || '0',
      currency: 'RUB',
      availability: product.meta?.availability || false,
      sku: product.meta?.artikul || '',
      weight: product.meta?.weight ? `${product.meta.weight} кг` : 'Не указан',
      delivery: {
        region: product.meta?.delivery || 'Сегодня — завтра',
        pickup: 'Сегодня'
      },
      description: [
        [product.content || 'Описание отсутствует'],
        ['Информация о покупке будет доступна после консультации с менеджером.'],
        ['Информация об оплате будет доступна после консультации с менеджером.'],
        ['Информация о доставке будет доступна после консультации с менеджером.'],
        ['Информация о гарантии будет доступна после консультации с менеджером.']
      ],
      tabs: [
        { title: 'Описание', active: true },
        { title: 'Как купить', active: false },
        { title: 'Оплата', active: false },
        { title: 'Доставка', active: false },
        { title: 'Гарантия', active: false }
      ],
      slug: productSlug.value
    };
    
    // Формируем хлебные крошки
    if (data.breadcrumbs && Array.isArray(data.breadcrumbs)) {
      breadcrumbs.value = data.breadcrumbs.map((item: any) => ({
        title: item.title,
        slug: item.slug || '',
        url: item.slug ? `/catalog/selection-${item.slug}` : null
      }));

      // Добавляем текущий продукт в конец хлебных крошек
      breadcrumbs.value.push({
        title: productData.value.title,
        url: '',  // Текущая страница не является ссылкой
        isCurrent: true
      });
    } else {
      breadcrumbs.value = [
        { 
          title: 'Каталог',
          url: '/catalog/CatalogPage'
        },
        { 
          title: productData.value.title,
          url: '',
          isCurrent: true
        }
      ];
    }
    
    // Загружаем похожие продукты, если они есть
    if (data.similar && Array.isArray(data.similar)) {
      similarProducts.value = data.similar.map((product: any) => ({
        id: product.id,
        title: product.title.length > 40 ? `${product.title.substring(0, 40)}…` : product.title,
        link: `/catalog/product-${product.slug}`,
        image: product.img?.webp_square_350 || product.img?.square_350 || '',
        alt: product.img?.alt?.description || product.title,
        available: product.meta?.availability || false,
        articul: product.meta?.artikul || '',
        oldPrice: product.meta?.price_old ? `${product.meta.price_old} ₽` : '',
        currentPrice: `${product.meta.price} ₽`,
        showOldPrice: !!product.meta?.price_old,
        slug: product.slug,
        weight: product.meta?.weight ? `${product.meta.weight} кг` : ''
      }));
    } else {
      // Если похожих товаров нет, оставляем пустой массив
      similarProducts.value = [];
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
  } finally {
    isLoading.value = false;
  }
};

const addToCart = (id: number) => {
  // Находим товар в списке похожих товаров
  const product = similarProducts.value.find(item => item.id === id);
  if (product) {
    CartService.addToCart({
      id: product.id,
      title: product.title,
      price: product.currentPrice,
      image: product.image,
      articul: product.articul,
      quantity: 1,
      slug: product.slug,
      available: product.available,
      weight: product.weight
    });
  }
};

const handleProductAddToCart = () => {
  // Обновляем UI после добавления в корзину
  // Product компонент сам вызывает CartService.addToCart
  forceRerender();
};

// Принудительное обновление компонентов
const forceRerender = () => {
  if (productData.value) {
    productData.value = { ...productData.value };
  }
  if (similarProducts.value.length) {
    similarProducts.value = [...similarProducts.value];
  }
};

// Обработчик изменения корзины
const handleCartChange = () => {
  forceRerender();
};

// Следим за изменениями slug в URL и перезагружаем данные при изменении
watch(productSlug, (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    // Прокручиваем страницу вверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Загружаем новые данные
    fetchProductData();
  }
});

// Загрузка данных при монтировании компонента
onMounted(() => {
  fetchProductData();
  // Добавляем обработчик события изменения корзины
  window.addEventListener('cart-changed', handleCartChange);
});

// Удаляем обработчики при размонтировании компонента
onUnmounted(() => {
  window.removeEventListener('cart-changed', handleCartChange);
});
</script>

<template>
<main class="main">
    
    <Breadcrumbs :items="breadcrumbs" />

    <div v-if="isLoading" class="loading">
      Загрузка информации о продукте...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <template v-else-if="productData">
      <Product 
        :product-data="productData"
        @add-to-cart="handleProductAddToCart"
        :key="productData.id + '-' + JSON.stringify(CartService.getItemQuantity(productData.id))"
      />

      <section v-if="similarProducts.length > 0" class="section selected-products selected-products--inside-product">
        <div class="section-title"><h3 class="section-title-tag">С этим продуктом покупают</h3></div>
        <div>
            <div>
                <Cards
                      :initial-cards="similarProducts.slice(0, 4)" 
                      :additional-cards="similarProducts.slice(4)" 
                      :load-more="similarProducts.length > 4"
                    @add-to-cart="addToCart"
                />
            </div>
        </div>
    </section>
    </template>

    <Gratitude />
</main>
</template>

<style lang="scss" scoped>
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
</style>