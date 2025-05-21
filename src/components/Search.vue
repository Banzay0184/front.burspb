<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

// Функция для выполнения поиска по клику на кнопку или отправке формы
const submitSearch = () => {
  if (searchQuery.value.trim()) {
    // Переходим на страницу поиска с передачей запроса
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
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
</script>

<template>
  <div itemtype="http://schema.org/WebSite" class="search">
    <form 
      itemprop="potentialAction" 
      itemtype="http://schema.org/SearchAction"
      @submit.prevent="submitSearch"
    >
      <meta itemprop="target" content="/search?q={q}" /> 
      <input 
        type="search" 
        name="search" 
        placeholder="Поиск по сайту" 
        id="search" 
        class="input input--search input--search-form"
        v-model="searchQuery"
        @keydown="handleKeydown"
      />
      <input itemprop="query-input" type="hidden" name="query" value="search" /> 
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