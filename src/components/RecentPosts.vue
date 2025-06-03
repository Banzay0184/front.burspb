<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHead } from '@vueuse/head';
import apiService from '../api/api';

interface Article {
  id: number;
  title: string;
  url: string;
  image: string;
  imageAlt: string;
  date: string;
  author: string;
  views: number;
  readTime: string;
  description?: string;
}

// Состояния для данных
const articles = ref<Article[]>([]);
const sectionTitle = ref('Последние статьи');
const isLoading = ref(false);

// Получение данных из API
const fetchRecentPosts = async () => {
  isLoading.value = true;
  
  try {
    const response = await apiService.blocks.getRecentPosts();
    
    if (response.data) {
      // Обновляем заголовок секции
      if (response.data.title) {
        sectionTitle.value = response.data.title;
      }
      
      // Получаем массив постов
      if (response.data.content && Array.isArray(response.data.content.posts)) {
        // Маппинг данных API в формат для компонента
        articles.value = response.data.content.posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          url: `/statji/${post.slug}`,
          image: post.img?.webp_full || post.img?.full || '',
          imageAlt: post.img?.alt?.title || post.title,
          date: post.date,
          author: post.author || '',
          views: post.meta?.views || 0,
          readTime: post.meta?.read_time ? `${post.meta.read_time} мин` : '5 мин',
          description: post.excerpt || ''
        }));
      }
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchRecentPosts();
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

// Создаем микроразметку для блога и статей
const blogSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: sectionTitle.value,
  description: 'Блог компании БурСПб о буровом оборудовании и технологиях',
  blogPost: articles.value.map(article => ({
    '@type': 'BlogPosting',
    headline: article.title,
    image: article.image,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author
    },
    description: article.description,
    wordCount: article.readTime,
    url: article.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
  }))
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(blogSchema.value)
    }
  ]
});
</script>

<template>
  <section class="section recent-posts" :class="{ 'is-loading': isLoading }">
    <div class="section-title">
      <h3 class="section-title-tag">{{ sectionTitle }}</h3>
    </div>
    <ul v-if="articles.length > 0" itemscope itemtype="http://schema.org/Blog" class="cards">
      <li v-for="article in articles" :key="article.id" class="cards__item">
        <div itemprop="blogPosts" itemscope itemtype="http://schema.org/BlogPosting" class="card card--post">
          <div class="card__background">
            <img 
              :src="article.image" 
              width="350" 
              height="350" 
              :alt="article.imageAlt" 
              loading="lazy" 
              itemprop="image" 
            />
          </div>
          <div class="card__inner">
            <a :href="article.url" class="">
              <h2 itemprop="headline" class="card__title">{{ article.title }}</h2>
            </a>
            <div v-if="article.description" class="card__excerpt">
              <p itemprop="description">{{ article.description }}</p>
            </div>
            <div class="card__meta">
              <div class="card__meta__row card__meta__row--post">
                <div class="card__meta__inline">
                  <span class="card__meta__inline__icon card__meta__inline__icon--date"></span>
                  <time itemprop="datePublished" :datetime="article.date" class="card__meta__inline__title">
                    {{ formatDate(article.date) }}
                  </time>
                </div>
                <div class="card__meta__inline card__meta__inline--author">
                  <span class="card__meta__inline__icon card__meta__inline__icon--author"></span>
                  <span itemprop="author" class="card__meta__inline__title">{{ article.author }}</span>
                </div>
                <div class="card__meta__inline">
                  <span class="card__meta__inline__icon card__meta__inline__icon--views"></span>
                  <span class="card__meta__inline__title">{{ article.views }}</span>
                </div>
                <div class="card__meta__inline">
                  <span class="card__meta__inline__icon card__meta__inline__icon--read-time"></span>
                  <span class="card__meta__inline__title">{{ article.readTime }}</span>
                </div>
              </div>
            </div>
            <div class="card__actions">
              <div>
                <span class="button-wrapper">
                <RouterLink :to="article.url" class="button button--blue button--black">
                    Подробнее
                </RouterLink>
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else-if="!isLoading" class="no-articles">
      <p>Статьи не найдены</p>
    </div>
  </section>
</template>

<style scoped>
.is-loading {
  opacity: 0.8;
  transition: opacity 0.3s;
}
.no-articles {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}
</style>