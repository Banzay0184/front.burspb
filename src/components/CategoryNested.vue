<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@vueuse/head';

interface CategoryItem {
  nav_id: number;
  title: string;
  url: string;
  params?: {
    is_link?: {
      title: string;
    };
  };
}

const props = defineProps<{
  items: CategoryItem[];
  title?: string;
}>();

// Создаем микроразметку для вложенных категорий
const categorySchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': props.title || 'Категории',
  'description': 'Список категорий товаров',
  'itemListElement': props.items.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.params?.is_link?.title || item.title,
    'url': item.url,
    'item': {
      '@type': 'WebPage',
      'name': item.params?.is_link?.title || item.title,
      'url': item.url
    }
  }))
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(categorySchema.value)
    }
  ]
});
</script>

<template>
  <section class="section category-nested">
    <h2 v-if="title" class="section-title">{{ title }}</h2>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <a :href="item.url">{{ item.params?.is_link?.title || item.title }}</a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.category-nested ul {
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  margin-left:-.75rem;
  margin-right:-.75rem
}
.category-nested li {
  position:relative;
  width:100%;
  min-height:5rem;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:flex-start;
  flex-wrap:wrap;
  padding:.75rem;
  margin:.75rem;
  background:#f1f3f6;
  font-size:1.2rem;
  font-weight:600;
  border-radius:.4rem;
  line-height:1.2;
  transition:all .35s ease
}
.category-nested li a {
  position:relative;
  display:block;
  width:100%
}
.category-nested li:after {
  position:absolute;
  top:50%;
  right:.75rem;
  transform:translateY(-50%);
  display:inline-block;
  content:"⟶";
  transition:all .35s ease
}
.category-nested li:hover {
  background:#bcc0d0
}
.category-nested li:hover:after {
  transform:translate(-.5rem,-50%)
}
@media screen and (min-width:480px) {
  .category-nested li {
    width:calc(50% - 1.5rem)
  }
}
@media screen and (min-width:728px) {
  .category-nested li {
    font-size:1.4rem;
    padding:1.5rem
  }
}
@media screen and (min-width:1200px) {
  .category-nested li {
    font-size:1.6rem;
    padding:2.25rem
  }
  .category-nested li:after {
    right:2.25rem
  }
}

</style>