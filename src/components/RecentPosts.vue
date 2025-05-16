<script setup lang="ts">
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

const articles: Article[] = [
  {
    id: 1,
    title: "Как выбрать скважинный насос",
    url: "/statji/kak-vybrat-skvazhinnyj-nasos",
    image: "/image/031f8a.jpeg",
    imageAlt: "Описание для centrobezhnyj-nasos",
    date: "2023-02-24",
    author: "Василий К.",
    views: 62,
    readTime: "10 мин",
    description: ""
  },
  {
    id: 2,
    title: "Как подобрать и установить скважинный оголовок",
    url: "/statji/kak-podobrat-i-ustanovit-skvazhinnyj-ogolovok",
    image: "/image/782840.webp",
    imageAlt: "Описание для 99vkzk4wws1pgih7e7sx5jnqbfofyuqy",
    date: "2023-02-24",
    author: "Василий К.",
    views: 67,
    readTime: "10 мин",
    description: ""
  },
  {
    id: 3,
    title: "МГБУ на воду",
    url: "/statji/mgbu-na-vodu",
    image: "/image/dbd406.webp",
    imageAlt: "Описание для 1",
    date: "2023-02-15",
    author: "Евгений Д.",
    views: 77,
    readTime: "1 мин",
    description: ""
  },
  {
    id: 4,
    title: "Буровое оборудование на воду",
    url: "/statji/burovoe-oborudovanie-na-vodu",
    image: "/image/0c69d5.webp",
    imageAlt: "Описание для 002",
    date: "2023-02-14",
    author: "Евгений Д.",
    views: 75,
    readTime: "1 мин",
    description: ""
  }
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};
</script>

<template>
  <section class="section recent-posts">
    <div class="section-title">
      <h3 class="section-title-tag">Последние статьи</h3>
    </div>
    <ul itemscope itemtype="http://schema.org/Blog" class="cards">
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
            <div class="card__excerpt">
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
                <RouterLink :to="article.url"  class="button button--blue button--black">
                    Подробнее
                </RouterLink>
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* Ваши стили здесь */
</style>