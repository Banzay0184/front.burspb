<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';
import { useRoute } from 'vue-router';
import { useSeo } from '../../utils/seo';

defineOptions({
    name: 'Okompanii.vue'
})

// Получаем роутер и текущий маршрут
const route = useRoute();

// Инициализация SEO
useSeo({
  title: route.meta.title as string,
  description: route.meta.description as string,
  canonical: route.fullPath
});

// Хлебные крошки
const breadcrumbs = computed(() => [
  { title: 'Главная', url: '/' },
  { title: 'О компании', url: '', isCurrent: true }
]);

// Создаем микроразметку для страницы о компании
const aboutSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  'name': 'О компании',
  'description': 'Информация о компании ООО ГК "Буровые технологии" - ведущем поставщике оборудования для бурения',
  'mainEntity': {
    '@type': 'Organization',
    'name': 'ООО ГК "Буровые технологии"',
    'description': 'Ведущий поставщик оборудования для бурения в России',
    'foundingDate': '2016',
    'legalName': 'ООО ГК "Буровые технологии"',
    'taxID': '7816318009',
    'vatID': '781601001',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Санкт-Петербург, Южное шоссе, 37 к.4 лит. Б',
      'addressLocality': 'Санкт-Петербург',
      'addressRegion': 'СПБ-Юг'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+78122427585',
      'contactType': 'customer service',
      'availableLanguage': 'Russian'
    },
    'sameAs': [
      'https://t.me/bur_spb',
      'https://api.whatsapp.com/send?phone=79213162621'
    ]
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(aboutSchema.value)
    }
  ]
});
</script>

<template>
<main class="main">
    <div class="wrapper">
        <Breadcrumbs :items="breadcrumbs" />
        
        <section class="page-header">
            <h1 class="page-title">О компании</h1>
        </section>
    </div>
    <div class="wrapper">
       <Gratitude />
    </div>
</main>
</template>

<style lang="scss" scoped>
.page-header {
  margin: 2rem 0;
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
}
</style>