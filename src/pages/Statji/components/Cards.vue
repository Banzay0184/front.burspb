<script setup lang="ts">
interface BlogPost {
  id: number;
  image: string;
  alt: string;
  title: string;
  url: string;
  date: string;
  author: string;
  views: number;
  readTime: string;
  description?: string;
}

const posts: BlogPost[] = [
  {
    id: 1,
    image: "/image/031f8a.jpeg",
    alt: "Описание для centrobezhnyj-nasos",
    title: "Как выбрать скважинный насос",
    url: "/Statji/StatjiDetail",
    date: "2023-02-24",
    author: "Василий К.",
    views: 64,
    readTime: "10",
  },
  {
    id: 2,
    image: "/image/782840.webp",
    alt: "Описание для 99vkzk4wws1pgih7e7sx5jnqbfofyuqy",
    title: "Как подобрать и установить скважинный оголовок",
    url: "/statji/kak-podobrat-i-ustanovit-skvazhinnyj-ogolovok",
    date: "2023-02-24",
    author: "Василий К.",
    views: 71,
    readTime: "10",
  },
  {
    id: 3,
    image: "/image/dbd406.webp",
    alt: "Описание для 1",
    title: "МГБУ на воду",
    url: "/statji/mgbu-na-vodu",
    date: "2023-02-15",
    author: "Евгений Д.",
    views: 82,
    readTime: "1 мин",
  },
  {
    id: 4,
    image: "/image/0c69d5.webp",
    alt: "Описание для 002",
    title: "Буровое оборудование на воду",
    url: "/statji/burovoe-oborudovanie-na-vodu",
    date: "2023-02-14",
    author: "Евгений Д.",
    views: 77,
    readTime: "1 мин",
  },
  {
    id: 5,
    image: "/image/b9499e.webp",
    alt: "Описание для 98",
    title: "Долото PDC",
    url: "/statji/doloto-pdc",
    date: "2023-02-14",
    author: "Евгений Д.",
    views: 78,
    readTime: "1 мин",
  },
  {
    id: 6,
    image: "/image/67821b.jpg",
    alt: "Описание для SONY DSC",
    title: "Шнек на буровую установку",
    url: "/statji/shnek-na-burovuyu-ustanovku",
    date: "2023-02-14",
    author: "Евгений Д.",
    views: 76,
    readTime: "1 мин",
  },
];
</script>

<template>
  <ul itemscope itemtype="http://schema.org/Blog" class="cards">
    <li v-for="post in posts" :key="post.id" class="cards__item">
      <div
        itemprop="blogPosts"
        itemscope
        itemtype="http://schema.org/BlogPosting"
        class="card card--post"
      >
        <div class="card__background">
          <img
            :src="post.image"
            width="350"
            height="350"
            :alt="post.alt"
            loading="lazy"
            itemprop="image"
          />
        </div>
        <div class="card__inner">
          <a :href="post.url" class="">
            <h2 itemprop="headline" class="card__title">{{ post.title }}</h2>
          </a>
          <div class="card__excerpt">
            <p itemprop="description">{{ post.description }}</p>
          </div>
          <div class="card__meta">
            <div class="card__meta__row card__meta__row--post">
              <div class="card__meta__inline">
                <span class="card__meta__inline__icon card__meta__inline__icon--date"></span>
                <time
                  itemprop="datePublished"
                  :datetime="post.date"
                  class="card__meta__inline__title"
                  >{{ new Date(post.date).toLocaleDateString() }}</time
                >
              </div>
              <div class="card__meta__inline card__meta__inline--author">
                <span class="card__meta__inline__icon card__meta__inline__icon--author"></span>
                <span itemprop="author" class="card__meta__inline__title">{{ post.author }}</span>
              </div>
              <div class="card__meta__inline">
                <span class="card__meta__inline__icon card__meta__inline__icon--views"></span>
                <span class="card__meta__inline__title">{{ post.views }}</span>
              </div>
              <div class="card__meta__inline">
                <span class="card__meta__inline__icon card__meta__inline__icon--read-time"></span>
                <span class="card__meta__inline__title">{{ post.readTime }}</span>
              </div>
            </div>
          </div>
          <div class="card__actions">
            <div>
              <span class="button-wrapper">
                <a :href="post.url" class="button button--blue button--black">Подробнее</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>