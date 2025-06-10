<template>
  <!-- Этот компонент только управляет SEO, без UI -->
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSeo, useSeoWithPagination, getPageDescription, getPageTitle } from '../utils/seo';

// Получаем текущий роут
const route = useRoute();

// Функция обновления SEO
const updateSeo = () => {
  const metaTitle = route.meta.title as string;
  const metaDescription = route.meta.description as string;
  const metaNoindex = route.meta.noindex as boolean;
  
  // Получаем заголовок и описание
  const title = getPageTitle(route.path, metaTitle);
  const description = getPageDescription(route.path, metaDescription);
  
  // Проверяем, это страница пагинации или нет
  const currentPage = parseInt(route.params.page as string) || 1;
  const isPagination = !!route.params.page;
  
  // Для страниц пагинации используем useSeoWithPagination
  if (isPagination) {
    // Для пагинации убираем /page/X из пути для базового пути
    const basePath = route.path.replace(/\/page\/\d+$/, '');
    
    useSeoWithPagination({
      title,
      description,
      currentPage,
      basePath,
      noindex: currentPage > 1, // Только первая страница индексируется
      type: 'website'
    });
  } else {
    // Для обычных страниц используем useSeo
    // Canonical URL будет автоматически определен на основе текущего окружения
    
    useSeo({
      title,
      description,
      // Убираем принудительное задание canonical - пусть определяется автоматически
      noindex: !!metaNoindex,
      type: 'website'
    });
  }
};

// Обновляем SEO при изменении роута
watch(() => route.path, () => {
  updateSeo();
}, { immediate: false });

// Обновляем SEO при монтировании
onMounted(() => {
  updateSeo();
});
</script> 