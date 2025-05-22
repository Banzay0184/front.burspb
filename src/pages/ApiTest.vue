<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService from '../api/api.ts'

const isLoading = ref(true)
const error = ref('')
const products = ref<any[]>([])
const globals = ref<any>(null)
const rawResponse = ref<any>(null)

const fetchData = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    // Тестируем получение продуктов
    const productsResponse = await apiService.products.getAll()
    rawResponse.value = productsResponse
    
    // Проверяем структуру ответа
    if (productsResponse.data && 'posts' in productsResponse.data && Array.isArray(productsResponse.data.posts)) {
      products.value = productsResponse.data.posts
      console.log('Успешно получены продукты:', products.value.length)
    } else {
      products.value = []
      console.warn('Не удалось найти массив продуктов в ответе', productsResponse)
    }
    
    // Тестируем получение глобальных настроек
    const globalsResponse = await apiService.getGlobals()
    globals.value = globalsResponse.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при получении данных'
    console.error('Ошибка API:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="api-test">
    <h1>Тестирование API</h1>
    
    <div v-if="isLoading" class="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Загрузка данных...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <h2>Ошибка при загрузке данных</h2>
      <p>{{ error }}</p>
      <v-btn @click="fetchData">Попробовать снова</v-btn>
    </div>
    
    <div v-else class="content">
      <div class="section">
        <h2>Продукты ({{ products.length }})</h2>
        <div v-if="products.length === 0">Нет доступных продуктов</div>
        <div v-else class="products-grid">
          <div v-for="product in products.slice(0, 5)" :key="product.id" class="product-card">
            <h3>{{ product.title }}</h3>
            <p v-if="product.price">Цена: {{ product.price }} ₽</p>
            <p v-if="product.price_formatted">Цена: {{ product.price_formatted }}</p>
            <div v-if="product.image" class="product-image">
              <img :src="product.image" :alt="product.title" width="150" />
            </div>
            <div v-else-if="product.images && product.images.length > 0" class="product-image">
              <img :src="product.images[0]" :alt="product.title" width="150" />
            </div>
            <div class="product-meta">
              <p>ID: {{ product.id }}</p>
              <p v-if="product.date">Дата: {{ new Date(product.date).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Глобальные настройки</h2>
        <pre v-if="globals">{{ JSON.stringify(globals, null, 2) }}</pre>
        <div v-else>Нет доступных глобальных настроек</div>
      </div>
      
      <div class="section api-debug">
        <h3>Детали ответа API</h3>
        <div v-if="rawResponse && rawResponse.data">
          <div v-if="rawResponse.data.pagination">
            <h4>Пагинация:</h4>
            <pre>{{ JSON.stringify(rawResponse.data.pagination, null, 2) }}</pre>
          </div>
          <div v-if="rawResponse.data.params">
            <h4>Параметры:</h4>
            <pre>{{ JSON.stringify(rawResponse.data.params, null, 2) }}</pre>
          </div>
        </div>
      </div>
      
      <v-btn @click="fetchData" color="primary" class="mt-4">Обновить данные</v-btn>
    </div>
  </div>
</template>

<style scoped>
.api-test {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 30px;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.api-debug {
  background: #f8f8f8;
  padding: 15px;
  border-radius: 8px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.product-image {
  margin: 10px 0;
  text-align: center;
}

.product-meta {
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
}

pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  overflow: auto;
  max-height: 300px;
}
</style> 