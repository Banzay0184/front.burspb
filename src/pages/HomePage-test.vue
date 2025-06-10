<template>
  <div class="test-page">
    <h1>Тестовая страница для SSG</h1>
    <p>Это статический контент</p>
    <div class="test-section">
      <h2>{{ title }}</h2>
      <p>Время рендеринга: {{ renderTime }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'

const title = ref('Тест SSG')
const renderTime = ref(new Date().toISOString())

// SEO мета-теги для теста
useHead({
  title: 'Тест SSG страница',
  meta: [
    { name: 'description', content: 'Тестовая страница для проверки SSG' }
  ]
})
</script>

<style scoped>
.test-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style> 