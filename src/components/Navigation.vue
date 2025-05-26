<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../api/api';

interface NavItem {
  nav_id: number;
  object_id: string;
  parent: boolean | string;
  icon: string;
  title: string;
  slug: string;
}

const navItems = ref<NavItem[]>([]);

const getIconPath = (iconClass: string) => {
  const iconMap: Record<string, string> = {
    'icon-page-1': '/image/e93b66.svg',
    'icon-page-2': '/image/3ff0cd.svg',
    'icon-page-3': '/image/d159ba.svg',
    'icon-page-4': '/image/4d5a09.svg',
    'icon-page-5': '/image/8774d1.svg',
    'icon-page-6': '/image/ec4772.svg',
    'icon-page-7': '/image/a16de5.svg'
  };
  
  return iconMap[iconClass] || '';
};

const getRoutePath = (slug: string) => {
  if (slug === 'garantiya') return '/garantiya';
  if (slug === 'oplata') return '/oplata';
  if (slug === 'dostavka') return '/dostavka';
  if (slug === 'o-kompanii') return '/o-kompanii';
  if (slug === 'kontakty') return '/kontakty';
  return `/${slug}`;
};

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    if (response.data && response.data.navigation && response.data.navigation.main) {
      navItems.value = response.data.navigation.main;
    }
  } catch (error) {
  }
};

onMounted(() => {
  fetchGlobalData();
});
</script>

<template>
  <nav class="navigation navigation--header">
    <ul itemtype="http://schema.org/SiteNavigationElement">
      <li class="navigation__item">
        <RouterLink to="/catalog" itemprop="url">
          <span class="navigation__item__icon navigation__item__icon--icon-page-1">
            <img src="/image/e93b66.svg" width="28" height="28" alt="Перейти в каталог" loading="lazy" />
          </span>
          <span class="navigation__item__title">Каталог</span>
        </RouterLink>
      </li>
      <li class="navigation__item">
        <RouterLink to="/statji" itemprop="url">
          <span class="navigation__item__icon navigation__item__icon--icon-page-7">
            <img src="/image/a16de5.svg" width="28" height="28" alt="Перейти к статьям" loading="lazy" />
          </span>
          <span class="navigation__item__title">Статьи</span>
        </RouterLink>
      </li>
      <li 
        v-for="item in navItems" 
        :key="item.nav_id"
        class="navigation__item"
      >
        <RouterLink :to="getRoutePath(item.slug)" itemprop="url">
          <span :class="`navigation__item__icon navigation__item__icon--${item.icon}`">
            <img 
              :src="getIconPath(item.icon)" 
              width="28" 
              height="28" 
              :alt="`Перейти к ${item.title}`" 
              loading="lazy" 
            />
          </span>
          <span class="navigation__item__title">{{ item.title }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
</style>