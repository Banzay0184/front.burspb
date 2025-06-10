<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';
import { useRoute } from 'vue-router';
import { useSeo } from '../../utils/seo';

    defineOptions({
      name: 'OplataPage.vue'
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
  { title: 'Оплата', url: '', isCurrent: true }
]);

// Создаем микроразметку для страницы оплаты
const paymentSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Оплата',
  'description': 'Информация о способах оплаты в интернет-магазине оборудования для бурения',
  'mainEntity': {
    '@type': 'Service',
    'name': 'Способы оплаты',
    'provider': {
      '@type': 'Organization',
      'name': 'ООО ГК "Буровые технологии"'
    },
    'offers': {
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': 'Оплата заказа',
        'description': 'Различные способы оплаты заказа'
      },
      'availableDeliveryMethod': [
        {
          '@type': 'PaymentMethod',
          'name': 'Наличными'
        },
        {
          '@type': 'PaymentMethod',
          'name': 'Безналичный расчет'
        },
        {
          '@type': 'PaymentMethod',
          'name': 'Наложенный платеж'
        },
        {
          '@type': 'PaymentMethod',
          'name': 'На карту Сбербанка'
        },
        {
          '@type': 'PaymentMethod',
          'name': 'Терминал'
        }
      ]
    }
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(paymentSchema.value)
    }
  ]
});
</script>

<template>
<main class="main">
    <div class="wrapper">
       <Breadcrumbs :items="breadcrumbs" />

        <article class="article post">
            <header><h1 class="title post__title">Оплата</h1></header>
            <div class="content post__content">
                <section>
                    <h2>Способы оплаты</h2>
                    <ul>
                        <li>Наличными</li>

                        <li>Безналичный расчет</li>

                        <li>Наложенный платеж</li>

                        <li>На карту Сбербанка</li>

                        <li>Терминал Возможность оплаты за товар с помощью банковских карт любых платёжных систем</li>
                    </ul>
                </section>
            </div>
        </article>
    </div>

    <div class="wrapper">
      <Gratitude />
    </div>
</main>


</template>

<style lang="scss" scoped>


</style>