<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Cards from '../components/Cards.vue';
import { getApiUrl } from '../api/api';

interface TestProduct {
  id: number;
  title: string;
  link: string;
  image: string;
  alt: string;
  availability: boolean;
  articul: string;
  oldPrice: string;
  currentPrice: string;
  showOldPrice: boolean;
  slug: string;
}

const products = ref<TestProduct[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const fetchProducts = async () => {
  try {
    const response = await fetch(getApiUrl('products'));
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных');
    }
    const data = await response.json();
    
    // Фильтруем продукты по разным статусам
    const filteredProducts = data.posts
      .filter((product: any) => {
        return !product.meta?.availability;
      })
      .map((product: any) => ({
        id: product.id,
        title: product.title,
        link: `/catalog/product-${product.slug}`,
        image: product.img?.webp_square_350 || product.img?.square_350 || '',
        alt: product.img?.alt?.description || product.title,
        availability: product.meta?.availability || null,
        articul: product.meta?.artikul || '',
        oldPrice: product.meta?.price_old ? `${product.meta.price_old} ₽` : '',
        currentPrice: product.meta?.price ? `${product.meta.price} ₽` : '0 ₽',
        showOldPrice: !!product.meta?.price_old,
        slug: product.slug
      }));

    products.value = filteredProducts;
  } catch (err) {
    console.error('Ошибка при загрузке продуктов:', err);
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
  } finally {
    isLoading.value = false;
  }
};

const addToCart = (id: number) => {
  console.log('Попытка добавить в корзину товар с ID:', id);
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="main">
    <div class="wrapper">
      <h1>Тестовые продукты (Нет в наличии)</h1>
      
      <div v-if="isLoading" class="loading">
        Загрузка продуктов...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else>
        <div v-if="products.length === 0" class="no-products">
          Продукты не найдены
        </div>
        
        <Cards
          v-else
          :initial-cards="products"
          :additional-cards="[]"
          :load-more="false"
          @add-to-cart="addToCart"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  padding: 2rem;
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #006079;
}

.loading, .error, .no-products {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #dc3545;
}

.no-products {
  color: #666;
}
</style> 