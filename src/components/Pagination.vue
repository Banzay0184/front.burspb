<script setup lang="ts">
import { ref, computed, watch } from 'vue';

defineOptions({
  name: 'Pagination'
});

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  baseUrl?: string;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  totalPages: 1,
  baseUrl: '/statji'
});

const emit = defineEmits(['page-change']);

const currentPageNumber = ref(Number(props.currentPage));

watch(() => props.currentPage, (newValue) => {
  currentPageNumber.value = Number(newValue);
});

const pages = computed(() => {
  const result = [];
  const totalPages = Math.max(1, props.totalPages);
  
  // Всегда показываем первую страницу, последнюю и несколько вокруг текущей
  const current = currentPageNumber.value;
  const delta = 1; // Количество страниц до и после текущей
  
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Первая страница
      i === totalPages || // Последняя страница
      (i >= current - delta && i <= current + delta) // Соседние с текущей
    ) {
      result.push(i);
    } else if (
      (i === current - delta - 1 && i > 1) ||
      (i === current + delta + 1 && i < totalPages)
    ) {
      // Добавляем разделитель
      result.push('...');
    }
  }
  
  // Удаляем дубликаты (например, если current = 2, то не нужен разделитель после 1)
  return result.filter((item, index, self) => 
    self.indexOf(item) === index
  );
});

const hasNextPage = computed(() => {
  return currentPageNumber.value < props.totalPages;
});

const hasPrevPage = computed(() => {
  return currentPageNumber.value > 1;
});

const nextPage = computed(() => {
  return Math.min(currentPageNumber.value + 1, props.totalPages);
});

const prevPage = computed(() => {
  return Math.max(currentPageNumber.value - 1, 1);
});

const handlePageChange = (page: number) => {
  const pageNum = Number(page);
  const currentNum = Number(currentPageNumber.value);
  
  if (pageNum !== currentNum && pageNum >= 1 && pageNum <= props.totalPages) {
    currentPageNumber.value = pageNum;
    emit('page-change', pageNum);
  }
};

const getPageUrl = (page: number) => {
  return page === 1 ? props.baseUrl : `${props.baseUrl}/page/${page}`;
};
</script>


<template>
  <nav v-if="totalPages > 1">
    <!-- Debug info, remove in production -->
    <!-- <div style="display: none;">
      currentPageNumber: {{ currentPageNumber }} ({{ typeof currentPageNumber }})
      props.currentPage: {{ props.currentPage }} ({{ typeof props.currentPage }})
    </div> -->
    
    <ul class="pagination">
      <li :class="`pagination__item pagination__item--prev ${!hasPrevPage ? 'pagination__item--prev--inactive' : ''}`">
        <a v-if="hasPrevPage" :href="getPageUrl(prevPage)" @click.prevent="handlePageChange(prevPage)" tabindex="0">
          ←
        </a>
        <span v-else>
          ←
        </span>
      </li>
      
      <template v-for="(page, index) in pages" :key="index">
        <li v-if="page !== '...'" class="pagination__item">
          <span v-if="Number(page) === Number(currentPageNumber)" class="pagination__item__active">
            <strong>{{ page }}</strong>
          </span>
          <a 
            v-else 
            :href="getPageUrl(page as number)" 
            @click.prevent="handlePageChange(page as number)"
            tabindex="0"
          >
            {{ page }}
          </a>
        </li>
        <li v-else class="pagination__item pagination__item--empty">
          <span>
            ...
          </span>
        </li>
      </template>
      
      <li :class="`pagination__item pagination__item--next ${!hasNextPage ? 'pagination__item--next--inactive' : ''}`">
        <a v-if="hasNextPage" :href="getPageUrl(nextPage)" @click.prevent="handlePageChange(nextPage)" tabindex="0">
          →
        </a>
        <span v-else>
          →
        </span>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 1rem 0;
  margin: 0;
  
  &__item {
    margin: 0 0.25rem;
    
    a, span {
      display: inline-block;
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: #333;
      border-radius: 4px;
      min-width: 2.5rem;
      text-align: center;
      
      &:hover {
        background-color: #f0f0f0;
      }
    }
    
    &__active {
      background-color: #0cf;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      display: inline-block;
      min-width: 2.5rem;
      text-align: center;
      
      strong {
        color: white;
      }
    }
    
    &--prev, &--next {
      a, span {
        font-size: 1.2rem;
        font-weight: bold;
      }
      
      &--inactive span {
        color: #ccc;
        cursor: not-allowed;
      }
    }
    
    &--empty span {
      background: none;
      cursor: default;
      
      &:hover {
        background: none;
      }
    }
  }
}
</style>