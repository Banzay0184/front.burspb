<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../api/api';

const router = useRouter();
const searchQuery = ref('');
const isSearchActive = ref(false);
const searchResults = ref<any[]>([]);
const isSearching = ref(false);

// Типы для результатов поиска
type SearchResultType = 'product' | 'article' | 'category';

// Ограничиваем количество результатов для отображения
const MAX_RESULTS = 5;

// Функция для поиска
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }
  
  isSearching.value = true;
  
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
  closeSearch();
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
      closeSearch();
      router.push(`/search/?s=${encodeURIComponent(searchQuery.value)}`);
    }
  }
};

// Открытие/закрытие мобильной версии поиска
const toggleSearch = () => {
  document.body.classList.toggle('m-search');
  isSearchActive.value = !isSearchActive.value;
  
  // Сбрасываем поиск при закрытии
  if (!isSearchActive.value) {
    searchQuery.value = '';
    searchResults.value = [];
  } else {
    // Фокусируемся на поле ввода при открытии
    setTimeout(() => {
      const searchInput = document.querySelector('.search-mobile__input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }
};

// Закрытие поиска
const closeSearch = () => {
  document.body.classList.remove('m-search');
  isSearchActive.value = false;
};

// Отслеживаем изменения в поисковом запросе
const handleSearchInput = () => {
  performSearch();
};

// Получаем иконку для типа результата
const getIconForType = (type: SearchResultType): string => {
  switch (type) {
    case 'product': return 'fa-shopping-cart';
    case 'article': return 'fa-file-text-o';
    case 'category': return 'fa-folder-o';
    default: return 'fa-search';
  }
};

// Удаляем класс m-search при размонтировании компонента
onUnmounted(() => {
  document.body.classList.remove('m-search');
});

// Добавляем обработчик Escape для закрытия поиска
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSearchActive.value) {
      closeSearch();
    }
  });
});
</script>

<template>
  <div class="search-mobile">
    <!-- Кнопка открытия поиска -->
    <button class="button button--search" @click="toggleSearch">
      <i class="fa fa-search"></i> <span>Поиск</span>
    </button>
    
    <!-- Модальное окно поиска (показывается при isSearchActive) -->
    <div v-if="isSearchActive" class="search-mobile__modal">
      <div class="search-mobile__header">
        <form @submit.prevent="submitSearch" class="search-mobile__form">
          <input 
            type="search" 
            class="search-mobile__input" 
            placeholder="Поиск по сайту" 
            v-model="searchQuery"
            @input="handleSearchInput"
          />
          <button type="submit" class="search-mobile__submit">
            <i class="fa fa-search"></i>
          </button>
        </form>
        <button class="search-mobile__close" @click="closeSearch">
          <i class="fa fa-times"></i>
        </button>
      </div>
      
      <div class="search-mobile__results">
        <div v-if="isSearching" class="search-mobile__loading">
          <i class="fa fa-spinner fa-spin"></i> Поиск...
        </div>
        <div v-else-if="searchResults.length === 0 && searchQuery" class="search-mobile__empty">
          Ничего не найдено
        </div>
        <ul v-else-if="searchResults.length > 0" class="search-mobile__list">
          <li 
            v-for="(result, index) in searchResults" 
            :key="`search-result-mobile-${index}`"
            class="search-mobile__item"
            @click="navigateToResult(result.url)"
          >
            <i :class="['fa', getIconForType(result.type)]"></i>
            <span class="search-mobile__item-title">{{ result.title }}</span>
            <span class="search-mobile__item-type">{{ result.type === 'product' ? 'Товар' : result.type === 'article' ? 'Статья' : 'Категория' }}</span>
          </li>
        </ul>
        <div v-else-if="!searchQuery" class="search-mobile__hint">
          Введите текст для поиска по сайту
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Используем только необходимые стили для мобильного поиска */
.search-mobile__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.search-mobile__header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-mobile__form {
  display: flex;
  flex-grow: 1;
  margin-right: 10px;
}

.search-mobile__input {
  flex-grow: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 16px;
}

.search-mobile__submit {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-mobile__close {
  background: none;
  border: none;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
}

.search-mobile__results {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
}

.search-mobile__loading,
.search-mobile__empty,
.search-mobile__hint {
  text-align: center;
  padding: 20px;
  color: #666;
}

.search-mobile__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-mobile__item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.search-mobile__item:last-child {
  border-bottom: none;
}

.search-mobile__item:hover {
  background-color: #f9f9f9;
}

.search-mobile__item i {
  margin-right: 15px;
  color: #007bff;
  width: 24px;
  text-align: center;
  font-size: 18px;
}

.search-mobile__item-title {
  flex-grow: 1;
  font-size: 16px;
}

.search-mobile__item-type {
  font-size: 14px;
  color: #888;
  margin-left: 10px;
}
</style>