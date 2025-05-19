<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';
import apiService from '../../api/api';

interface Post {
  id: number;
  title: string;
  date: string;
  modified: string;
  author: string;
  img: {
    full: string;
    square_350: string;
    webp_full: string | null;
    webp_square_350: string | null;
    alt: {
      title: string;
      description: string;
    }
  };
  content: string;
  category: Array<{
    id: number;
    title: string;
    slug: string;
    parent: null | number;
  }>;
  meta: {
    priority_category: string;
    read_time: string | null;
    views: number;
  };
  blocks: {
    gratitude: any;
    comments: boolean;
  };
  breadcrumbs: Array<{
    title: string;
    slug: string;
  }>;
  similar: Array<any>;
}

const route = useRoute();
const post = ref<Post | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const similarPosts = ref<any[]>([]);

const getPostSlug = () => {
  // Получаем slug из параметров маршрута
  return route.params.slug || 'kak-vybrat-skvazhinnyj-nasos';
};

const fetchPostData = async () => {
  try {
    isLoading.value = true;
    const slug = getPostSlug();
    const response = await apiService.posts.getBySlug(slug as string);
    
    if (response.data) {
      // Приводим полученные данные к типу Post
      const apiData = response.data as unknown as Post;
      post.value = apiData;
      
      // Получаем похожие статьи, если они есть
      if (apiData.similar && Array.isArray(apiData.similar)) {
        similarPosts.value = apiData.similar.slice(0, 4); // Берем только первые 4 похожие статьи
      }
    } else {
      error.value = 'Не удалось загрузить статью. Пожалуйста, попробуйте позже.';
    }
  } catch (err) {
    console.error('Ошибка при загрузке данных статьи:', err);
    error.value = 'Произошла ошибка при загрузке статьи. Пожалуйста, попробуйте позже.';
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const getImageUrl = (post: Post) => {
  return post.img.webp_full || post.img.full;
};

const getCategoryUrl = (category: { slug: string }) => {
  return `/statji/category/${category.slug}`;
};

onMounted(() => {
  fetchPostData();
});
</script>

<template>
  <div class="main">
    <div class="wrapper">
      <div v-if="isLoading" class="loading-container">
        <p>Загрузка статьи...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
      </div>
      
      <template v-else-if="post">
        <Breadcrumbs />

        <article itemscope itemtype="http://schema.org/Article" class="post">
          <header>
            <h1 itemprop="headline" class="title post__title">{{ post.title }}</h1>
            
            <div v-if="post.category && post.category.length > 0" class="post__categories">
              <a 
                v-for="category in post.category" 
                :key="category.id" 
                :href="getCategoryUrl(category)" 
                class="post__category-link"
              >
                {{ category.title }}
              </a>
            </div>
            
            <div class="thumbnail post__thumbnail">
              <img itemprop="image" :src="getImageUrl(post)" :alt="post.img.alt.description">
            </div>
            <div class="post__meta">
              <div class="post__meta__item">
                <span class="post__meta__icon post__meta__icon--date"></span>
                <time itemprop="datePublished" :datetime="post.date" class="post__meta__title">{{ formatDate(post.date) }}</time>
              </div>
              <div class="post__meta__item">
                <span class="post__meta__icon post__meta__icon--views"></span>
                <span class="post__meta__title">{{ post.meta.views }}</span>
              </div>
              <div v-if="post.meta.read_time" class="post__meta__item">
                <span class="post__meta__icon post__meta__icon--read-time"></span>
                <span class="post__meta__title">{{ post.meta.read_time }}</span>
              </div>
              <div class="post__meta__item">
                <span class="post__meta__icon post__meta__icon--author"></span>
                <span itemprop="author" class="post__meta__title">{{ post.author }}</span>
              </div>
            </div>
          </header>
          <section itemprop="articleBody" class="content post__content" v-html="post.content">
          </section>
          <meta itemscope itemprop="mainEntityOfPage" itemtype="https://schema.org/WebPage" 
                :itemid="`https://burspb.com/statji/${getPostSlug()}`">
        </article>
        
        <!-- Похожие статьи -->
        <div v-if="similarPosts.length > 0" class="similar-posts">
          <h2 class="similar-posts__title">Похожие статьи</h2>
          <div class="similar-posts__grid">
            <div v-for="(similarPost, index) in similarPosts" :key="index" class="similar-posts__item">
              <a :href="`/statji/${similarPost.post_name}`" class="similar-posts__link">
                <h3 class="similar-posts__item-title">{{ similarPost.post_title }}</h3>
              </a>
            </div>
          </div>
        </div>
        
        <Gratitude />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-container,
.error-container {
  padding: 2rem;
  text-align: center;
}

.error-container {
  color: #e53935;
}

.post {
  &__categories {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  
  &__category-link {
    font-size: 0.85rem;
    background-color: #f0f0f0;
    border-radius: 3px;
    padding: 0.3rem 0.7rem;
    margin-right: 0.7rem;
    margin-bottom: 0.7rem;
    color: #555;
    text-decoration: none;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #e0e0e0;
    }
  }
}

.similar-posts {
  margin: 3rem 0;
  
  &__title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 992px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  &__item {
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 4px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #f0f0f0;
    }
  }
  
  &__link {
    text-decoration: none;
    color: inherit;
  }
  
  &__item-title {
    font-size: 1rem;
    margin: 0;
  }
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