<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';

const router = useRouter();
const searchQuery = ref('');

// Функция для выполнения поиска по клику на кнопку или отправке формы
const submitSearch = () => {
  if (searchQuery.value.trim()) {
    // Переходим на страницу поиска с передачей запроса
    router.push({
      path: '/search',
      query: { search: searchQuery.value.trim() }
    });
  }
};

// Обработка нажатия Enter в поле поиска
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && searchQuery.value.trim()) {
    event.preventDefault();
    submitSearch();
  }
};

// Создаем микроразметку для поиска
const searchSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: 'https://burspb.ru',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://burspb.ru/search?search={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(searchSchema.value)
    }
  ]
});
</script>

<template>
  <div class="search">
    <form @submit.prevent="submitSearch">
      <input 
        type="search" 
        name="search" 
        placeholder="Поиск по сайту" 
        id="search" 
        class="input input--search input--search-form"
        v-model="searchQuery"
        @keydown="handleKeydown"
      />
      <button 
        type="submit"
        class="button button--search button--search-form"
      >
        <i class="fa fa-search"></i> <span>Поиск</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Стили будут использоваться из глобальной таблицы стилей */
</style>