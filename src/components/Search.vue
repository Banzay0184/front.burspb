<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../api/api';

const router = useRouter();
const searchQuery = ref('');
const isSearching = ref(false);
const searchResults = ref<any[]>([]);
const searchActive = ref(false);

// Ограничиваем количество результатов для отображения
const MAX_RESULTS = 5;

// Структура данных для поиска
interface SearchableItem {
  title: string;
  url: string;
  type: 'product' | 'article' | 'category';
  description?: string;
}

// Функция для поиска по введенному запросу
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }
  
  isSearching.value = true;
  searchActive.value = true;
  
  try {
    // Используем API для поиска
    const response = await apiService.search(searchQuery.value);
    
    if (response.data && Array.isArray(response.data)) {
      // Преобразуем данные из API в формат SearchableItem
      searchResults.value = response.data
        .map((item) => ({
          title: item.title || item.name || '',
          url: item.url || '',
          type: item.type || 'product',
          description: item.description || ''
        }))
        .slice(0, MAX_RESULTS);
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error('Ошибка при поиске:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

// Функция для навигации к результату
const navigateToResult = (url: string) => {
  searchQuery.value = '';
  searchResults.value = [];
  searchActive.value = false;
  router.push(url);
};

// Функция для выполнения поиска по клику на кнопку
const submitSearch = () => {
  if (searchQuery.value.trim()) {
    // Если есть результаты, переходим к первому
    if (searchResults.value.length > 0) {
      navigateToResult(searchResults.value[0].url);
    } else {
      // Иначе переходим на страницу поиска с передачей запроса
      router.push(`/search/?s=${encodeURIComponent(searchQuery.value)}`);
    }
  }
};

// Закрытие результатов поиска при клике вне компонента
const closeSearch = (e: MouseEvent) => {
  if (searchActive.value) {
    const target = e.target as HTMLElement;
    if (!target.closest('.search')) {
      searchActive.value = false;
    }
  }
};

// Добавляем слушатель кликов при монтировании компонента
onMounted(() => {
  document.addEventListener('click', closeSearch);
});

// Отслеживаем изменения в поисковом запросе
const handleSearchInput = () => {
  performSearch();
};

// Получаем иконку для типа результата
const getIconForType = (type: 'product' | 'article' | 'category'): string => {
  switch (type) {
    case 'product': return 'fa-shopping-cart';
    case 'article': return 'fa-file-text-o';
    case 'category': return 'fa-folder-o';
    default: return 'fa-search';
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
      <meta itemprop="target" content="/search/?s=null" /> 
      <input 
        type="search" 
        name="search" 
        placeholder="Поиск по сайту" 
        id="search" 
        class="input input--search input--search-form"
        v-model="searchQuery"
        @input="handleSearchInput"
      />
      <input itemprop="query-input" type="hidden" name="query" /> 
      <button 
        type="submit"
        class="button button--search button--search-form"
      >
        <i class="fa fa-search"></i> <span>Поиск</span>
      </button>
    </form>
    
    <!-- Выпадающие результаты поиска -->
    <div v-if="searchActive && searchQuery" class="search-results">
      <div v-if="isSearching" class="search-loading">
        <i class="fa fa-spinner fa-spin"></i> Поиск...
      </div>
      <div v-else-if="searchResults.length === 0 && searchQuery" class="search-empty">
        Ничего не найдено
      </div>
      <ul v-else class="search-results-list">
        <li 
          v-for="(result, index) in searchResults" 
          :key="`search-result-${index}`"
          class="search-result-item"
          @click="navigateToResult(result.url)"
        >
          <i :class="['fa', getIconForType(result.type)]"></i>
          <span class="search-result-title">{{ result.title }}</span>
          <span class="search-result-type">{{ result.type === 'product' ? 'Товар' : result.type === 'article' ? 'Статья' : 'Категория' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Стили будут использоваться из глобальной таблицы стилей */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.search-loading,
.search-empty {
  padding: 15px;
  text-align: center;
  color: #666;
}

.search-results-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-result-item {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f9f9f9;
}

.search-result-item i {
  margin-right: 10px;
  color: #007bff;
  width: 20px;
  text-align: center;
}

.search-result-title {
  flex-grow: 1;
}

.search-result-type {
  font-size: 0.8em;
  color: #888;
  margin-left: 10px;
}
</style>