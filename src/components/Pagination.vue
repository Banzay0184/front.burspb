<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@vueuse/head';

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

// Убираем локальное состояние, используем напрямую props
const pages = computed(() => {
  const result = [];
  const totalPages = Math.max(1, props.totalPages);
  
  // Всегда показываем первую страницу, последнюю и несколько вокруг текущей
  const current = props.currentPage;
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
  
  // Удаляем дубликаты
  return result.filter((item, index, self) => 
    self.indexOf(item) === index
  );
});

const hasNextPage = computed(() => {
  return props.currentPage < props.totalPages;
});

const hasPrevPage = computed(() => {
  return props.currentPage > 1;
});

const nextPage = computed(() => {
  return Math.min(props.currentPage + 1, props.totalPages);
});

const prevPage = computed(() => {
  return Math.max(props.currentPage - 1, 1);
});

const handlePageChange = (page: number) => {
  const pageNum = Number(page);
  
  if (pageNum !== props.currentPage && pageNum >= 1 && pageNum <= props.totalPages) {
    emit('page-change', pageNum);
  }
};

const getPageUrl = (page: number) => {
  return page === 1 ? props.baseUrl : `${props.baseUrl}/page/${page}`;
};

// Создаем микроразметку для пагинации
const paginationSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `Страница ${props.currentPage} из ${props.totalPages}`,
  pageStart: props.currentPage,
  pageEnd: props.currentPage,
  numberOfItems: props.totalPages,
  isPartOf: {
    '@type': 'WebSite',
    name: 'БурСПб',
    url: 'https://burspb.ru'
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://burspb.ru'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: props.baseUrl.replace('/', ''),
        item: `https://burspb.ru${props.baseUrl}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Страница ${props.currentPage}`,
        item: `https://burspb.ru${getPageUrl(props.currentPage)}`
      }
    ]
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(paginationSchema.value)
    }
  ]
});
</script>


<template>
  <nav v-if="totalPages > 1">
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
          <span v-if="Number(page) === Number(currentPage)" class="pagination__item__active">
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
  align-items: center;
  list-style: none;
  padding: 1rem 0;
  margin: 0;
  gap: 0.25rem;
  
  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    
    a, span {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      text-decoration: none;
      color: #333;
      border-radius: 4px;
      min-width: 2.5rem;
      min-height: 2.5rem;
      
      &:hover {
        background-color: #f0f0f0;
      }
    }
    
    &__active {
      background-color: #0cf;
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2.5rem;
      min-height: 2.5rem;
      
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