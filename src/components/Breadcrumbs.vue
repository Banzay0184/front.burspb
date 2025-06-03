<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { computed } from 'vue';

interface BreadcrumbItem {
  title: string;
  url?: string;
  slug?: string;
  isCurrent?: boolean;
  type?: string;
}

const props = defineProps<{
  items?: BreadcrumbItem[];
}>();

const getBreadcrumbUrl = (item: BreadcrumbItem) => {
  if (item.isCurrent) return '';
  if (item.url) return item.url;
  if (item.slug) {
    if (item.slug.startsWith('category-') || item.slug.startsWith('selection-')) {
      return `/catalog/${item.slug}`;
    }
    const prefix = item.type === 'taxonomy' ? 'category' : 'selection';
    return `/catalog/${prefix}-${item.slug}`;
  }
  return '';
};

// Создаем микроразметку для хлебных крошек
const breadcrumbSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: props.items?.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.title,
    item: item.isCurrent ? window.location.href : `https://burspb.ru${getBreadcrumbUrl(item)}`
  })) || []
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(breadcrumbSchema.value)
    }
  ]
});
</script>

<template>
  <nav class="breadcrumbs" aria-label="Навигация по сайту">
    <ul itemscope itemtype="http://schema.org/BreadcrumbList">
      <template v-if="items && items.length > 0">
        <li 
          v-for="(item, index) in items" 
          :key="index"
          itemprop="itemListElement" 
          itemscope 
          itemtype="http://schema.org/ListItem"
          :class="{ 'current': item.isCurrent }"
        >
          <template v-if="getBreadcrumbUrl(item)">
            <a 
              :href="getBreadcrumbUrl(item)" 
              itemprop="item"
            >
              <span itemprop="name">{{ item.title }}</span>
            </a>
          </template>
          <template v-else>
            <span itemprop="name">{{ item.title }}</span>
          </template>
          <meta itemprop="position" :content="String(index + 1)" />
        </li>
      </template>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.breadcrumbs {
  width: 100%;
  margin-bottom: 1.5rem;
  line-height: 1;
  
  @media screen and (min-width: 768px) {
    margin-bottom: 4.5rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    
    li {
      display: inline-flex;
      align-items: center;
      color: #333;
      
      &:after {
        content: "→";
        margin-left: 0.75rem;
        color: #666;
      }
      
      &:last-child {
        font-weight: 600;
        
        &:after {
          content: none;
        }
      }

      &.current {
        font-weight: 600;
        color: var(--primary-color, #050506);
      }
      
      a {
        color: inherit;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>