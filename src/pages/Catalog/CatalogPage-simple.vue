<template>
  <div>
    <h2>Каталог товаров</h2>
    <p>Здесь будут отображаться товары каталога</p>
    <div class="products-grid">
      <div class="product-card" v-for="product in staticProducts" :key="product.id">
        <h3>{{ product.title }}</h3>
        <p>{{ product.description }}</p>
        <span class="price">{{ product.price }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Статические данные для SSG
const staticProducts = ref([
  {
    id: 1,
    title: 'Буровая установка БУ-1000',
    description: 'Профессиональная буровая установка для глубокого бурения',
    price: '1 500 000 ₽'
  },
  {
    id: 2,
    title: 'Долото PDC 215.9 мм',
    description: 'Алмазное долото для эффективного бурения',
    price: '85 000 ₽'
  },
  {
    id: 3,
    title: 'Буровые трубы НКТ-73',
    description: 'Насосно-компрессорные трубы высокого качества',
    price: '12 500 ₽'
  }
]);

// Мета-теги управляются через router.meta
</script>

<style scoped>
h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  margin-bottom: 30px;
  color: #666;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.product-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 18px;
}

.product-card p {
  color: #666;
  margin-bottom: 15px;
  font-size: 14px;
}

.price {
  font-weight: bold;
  color: #007bff;
  font-size: 16px;
}
</style> 