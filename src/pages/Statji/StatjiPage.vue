<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Pagination from '../../components/Pagination.vue';
import Cards from './components/Cards.vue';
import apiService from '../../api/api';

interface ApiResponse {
  location: null;
  category: null | {
    term_id: number;
    name: string;
    slug: string;
    term_group: number;
    term_taxonomy_id: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
    filter: string;
    cat_ID: number;
    category_count: number;
    category_description: string;
    cat_name: string;
    category_nicename: string;
    category_parent: number;
  };
  pagination: {
    posts_per_page: number;
    current: number;
    previous: null | number;
    next: null | number;
    pages_total: number;
  };
  posts: Array<any>;
}

const route = useRoute();
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(true);
const error = ref<string | null>(null);
const posts = ref<any[]>([]);
const categoryName = ref<string | null>(null);
const categorySlug = ref<string | null>(null);

const getCategorySlug = () => {
  // Получаем slug категории из параметров маршрута, если он есть
  return typeof route.params.category === 'string' ? route.params.category : null;
};

const fetchPosts = async (page = 1) => {
  try {
    isLoading.value = true;
    const category = getCategorySlug();
    categorySlug.value = category;
    
    let response;
    if (category) {
      // Если указана категория, получаем статьи только этой категории
      response = await apiService.posts.getByCategory(category);
    } else {
      // Иначе получаем все статьи
      response = await apiService.posts.getAll();
    }
    
    if (response.data && typeof response.data === 'object') {
      const apiData = response.data as unknown as ApiResponse;
      
      if (apiData.pagination) {
        totalPages.value = apiData.pagination.pages_total || 1;
        currentPage.value = page;
      }
      
      if (apiData.category) {
        categoryName.value = apiData.category.name || null;
      } else {
        categoryName.value = null;
      }
      
      if (apiData.posts && Array.isArray(apiData.posts)) {
        posts.value = apiData.posts;
      } else {
        posts.value = [];
      }
    }
  } catch (err) {
    error.value = 'Не удалось загрузить статьи. Пожалуйста, попробуйте позже.';
    posts.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPosts(1);
});

// Обновляем данные при изменении маршрута
watch(() => route.params.category, () => {
  fetchPosts(1);
});

const handlePageChange = (page: number) => {
  fetchPosts(page);
};
</script>

<template>
  <div class="main">
    <div class="wrapper category-posts">

      <Breadcrumbs />

      <section class="section recent-posts">
        <div class="section-title">
          <h3 class="section-title-tag" v-if="categoryName">
            Статьи категории "{{ categoryName }}"
          </h3>
          <h3 class="section-title-tag" v-else>Все статьи</h3>
        </div>

        <div v-if="isLoading" class="loading">
          <p>Загрузка статей...</p>
        </div>
        
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
        </div>
        
        <template v-else>
          <Cards :posts="posts" />
          
          <div v-if="posts.length === 0" class="no-posts">
            <p>Статьи не найдены</p>
          </div>
          
          <Pagination 
            v-if="posts.length > 0"
            :current-page="currentPage" 
            :total-pages="totalPages" 
            :base-url="categorySlug ? `/statji/category/${categorySlug}` : '/statji'"
            @page-change="handlePageChange"
          />
        </template>
      </section>

    </div>
  </div>

</template>

<style lang="scss" scoped>
.loading, .error, .no-posts {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #e53935;
}

.no-posts {
  color: #666;
  font-size: 1.2rem;
}

.categories-full>ul>li {
  margin-bottom: 3rem;
  position: relative
}

.categories-full>ul>li li {
  padding-left: 5.3rem;
  margin-bottom: .75rem
}

@media screen and (max-width:1199.99px) {
  .categories-full>ul>li>ul {
    display: none
  }

  .categories-full>ul>li.active>ul {
    display: block
  }
}

.categories-full__parent {
  font-weight: 700;
  display: flex;
  flex-direction: row;
  line-height: 1.2
}

.categories-full__parent span {
  min-width: 3.8rem;
  max-width: 3.8rem;
  flex-basis: 3.8rem;
  margin-right: 1.5rem
}

.categories-full__parent span img,
.categories-full__parent span svg {
  width: 100%;
  height: auto
}

.categories-full__parent span .icon-background {
  fill: #0cf
}

@media screen and (max-width:1199.999px) {
  .categories-full__parent__mobile-action {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 2rem;
    height: 2rem;
    border: thin solid #aaa;
    border-radius: 50%;
    cursor: pointer
  }

  .categories-full__parent__mobile-action:before {
    line-height: 1;
    content: "";
    font-family: FontAwesome;
    font-size: 1rem;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #aaa
  }

  .active .categories-full__parent__mobile-action:before {
    transform: translate(-50%, -50%) rotate(180deg)
  }
}

@media screen and (min-width:768px) {
  .categories-full>ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: -2.25rem;
    margin-right: -2.25rem
  }

  .categories-full>ul>li {
    display: block;
    width: calc(50% - 4.5rem);
    margin-left: 2.25rem;
    margin-right: 2.25rem
  }
}

@media screen and (min-width:1200px) {
  .categories-full>ul {
    margin-left: -1.5rem;
    margin-right: -1.5rem
  }

  .categories-full>ul>li {
    width: calc(25% - 3rem);
    margin-left: 1.5rem;
    margin-right: 1.5rem
  }
}
</style>