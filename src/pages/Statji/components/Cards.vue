<script setup lang="ts">
// Импорты не используются

interface Post {
  id: number;
  title: string;
  date: string;
  modified: string;
  author: string;
  slug: string;
  img: {
    full: string;
    square_350: string;
    webp_full: string;
    webp_square_350: string | null;
    alt: {
      title: string;
      description: string;
    }
  };
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
  excerpt: string | null;
}

defineProps<{
  posts: Post[];
}>();

const getImageUrl = (post: Post) => {
  return post.img.webp_square_350 || post.img.webp_full || post.img.full;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const getPostUrl = (post: Post) => {
  return `/statji/${post.slug}`;
};

const getCategoryUrl = (category: { slug: string }) => {
  return `/statji/category/${category.slug}`;
};

// Функция formatAuthor удалена, т.к. не используется
</script>

<template>
  <div v-if="posts && posts.length > 0" class="cards">
    <div class="card" v-for="post in posts" :key="post.id">
      <div class="card__image">
        <a :href="getPostUrl(post)" :title="post.title">
          <img loading="lazy" :src="getImageUrl(post)" :alt="post.img.alt.title">
        </a>
      </div>
      <div class="card__content">
        <div v-if="post.category && post.category.length > 0" class="card__content__categories">
          <a 
            v-for="category in post.category" 
            :key="category.id" 
            :href="getCategoryUrl(category)" 
            class="card__content__category-link"
          >
            {{ category.title }}
          </a>
        </div>
        <a :href="getPostUrl(post)" :title="post.title">
          <h3 class="card__content__title">{{ post.title }}</h3>
        </a>
        <div class="card__content__meta">
          <span class="card__content__meta__item card__content__meta__item--date">{{ formatDate(post.date) }}</span>
          <span class="card__content__meta__item card__content__meta__item--views">{{ post.meta.views }}</span>
          <span v-if="post.meta.read_time" class="card__content__meta__item card__content__meta__item--read-time">{{ post.meta.read_time }}</span>
          <span class="card__content__meta__item card__content__meta__item--author">{{ post.author }}</span>
        </div>
        <div v-if="post.excerpt" class="card__content__excerpt">
          <p>{{ post.excerpt }}</p>
        </div>
        <div class="card__content__button">
          <span class="button-wrapper">
            <a :href="getPostUrl(post)" class="button button--blue button--black">Подробнее</a>
          </span>
        </div>
      </div>
    </div>
  </div>
  <p v-else class="no-posts">
    Статьи отсутствуют или загружаются...
  </p>
</template>

<style lang="scss" scoped>
.no-posts {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  margin: -1.5rem;
}

.card {
  width: 100%;
  margin: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;

  @media (min-width: 576px) {
    width: calc(50% - 3rem);
  }

  @media (min-width: 992px) {
    width: calc(33.333% - 3rem);
  }

  @media (min-width: 1200px) {
    width: calc(25% - 3rem);
  }

  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }

  &__image {
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  &__content {
    padding: 1rem;
    
    &__categories {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 0.7rem;
    }
    
    &__category-link {
      font-size: 0.75rem;
      background-color: #f0f0f0;
      border-radius: 3px;
      padding: 0.2rem 0.5rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      color: #555;
      text-decoration: none;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #e0e0e0;
      }
    }

    &__title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.4;
      height: 3.36rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &__meta {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #666;

      &__item {
        margin-right: 1rem;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;

        &--date::before {
          content: "\f073";
          font-family: "FontAwesome";
          margin-right: 0.3rem;
        }

        &--views::before {
          content: "\f06e";
          font-family: "FontAwesome";
          margin-right: 0.3rem;
        }

        &--read-time::before {
          content: "\f017";
          font-family: "FontAwesome";
          margin-right: 0.3rem;
        }

        &--author::before {
          content: "\f007";
          font-family: "FontAwesome";
          margin-right: 0.3rem;
        }
      }
    }

    &__excerpt {
      height: 4.5rem;
      overflow: hidden;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #333;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    &__button {
      .button-wrapper {
        display: block;
        text-align: center;
      }

      .button {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #0056b3;
        }

        &--blue {
          background-color: #007bff;

          &:hover {
            background-color: #0056b3;
          }
        }

        &--black {
          background-color: #333;

          &:hover {
            background-color: #555;
          }
        }
      }
    }
  }
}
</style>