<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@vueuse/head';

defineOptions({
    name: 'CookiePolicyPage.vue'
});

// Создаем микроразметку для страницы политики использования файлов cookie
const cookiePolicySchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Политика обработки файлов Cookie',
  'description': 'Политика обработки файлов cookie и аналогичных технологий на сайте ООО "БурТехСнаб"',
  'mainEntity': {
    '@type': 'Article',
    'headline': 'Политика обработки файлов Cookie',
    'datePublished': '2023-01-01',
    'dateModified': '2023-01-01',
    'author': {
      '@type': 'Organization',
      'name': 'ООО "БурТехСнаб"',
      'email': 'info@burtehsnab.ru',
      'telephone': '+7XXXXXXXXXX'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'ООО "БурТехСнаб"',
      'logo': {
        '@type': 'ImageObject',
        'url': '/image/7dd5a8.svg'
      }
    },
    'articleBody': 'Настоящая Политика обработки файлов cookie (далее — "Политика") объясняет, как ООО "БурТехСнаб" (далее — "Компания") использует файлы cookie и аналогичные технологии на нашем сайте.'
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(cookiePolicySchema.value)
    }
  ]
});
</script>

<template>
    <main class="main">
        <div class="wrapper">
            <div class="container">
                <div class="cookie-policy-content" itemscope itemtype="https://schema.org/WebPage">
                    <h1 itemprop="name">Политика обработки файлов Cookie</h1>

                    <div itemprop="mainContentOfPage">
                        <p>Настоящая Политика обработки файлов cookie (далее — "Политика") объясняет, как ООО "БурТехСнаб" (далее — "Компания") использует файлы cookie и аналогичные технологии на нашем сайте.</p>

                        <h2>1. Что такое файлы cookie?</h2>
                        <p>Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении веб-сайта. Они помогают сделать использование сайта более удобным и эффективным.</p>

                        <h2>2. Типы используемых cookie</h2>
                        <p>На нашем сайте используются следующие типы файлов cookie:</p>
                        <ul>
                            <li><strong>Необходимые cookie</strong> — обеспечивают базовую функциональность сайта</li>
                            <li><strong>Функциональные cookie</strong> — запоминают ваши предпочтения и настройки</li>
                            <li><strong>Аналитические cookie</strong> — помогают нам улучшать работу сайта</li>
                        </ul>

                        <h2>3. Как мы используем cookie</h2>
                        <p>Мы используем файлы cookie для следующих целей:</p>
                        <ul>
                            <li>Обеспечение безопасности и защиты от мошенничества</li>
                            <li>Запоминание ваших предпочтений и настроек</li>
                            <li>Анализ использования сайта для его улучшения</li>
                            <li>Предоставление персонализированного контента</li>
                        </ul>

                        <h2>4. Управление cookie</h2>
                        <p>Вы можете контролировать использование файлов cookie следующим образом:</p>
                        <ul>
                            <li>Настроить параметры вашего браузера для блокировки или удаления cookie</li>
                            <li>Использовать режим инкогнито для анонимного просмотра</li>
                            <li>Отключить определенные типы cookie через настройки сайта</li>
                        </ul>

                        <h2>5. Срок хранения cookie</h2>
                        <p>Файлы cookie могут храниться на вашем устройстве в течение разного времени:</p>
                        <ul>
                            <li>Сессионные cookie — удаляются после закрытия браузера</li>
                            <li>Постоянные cookie — остаются на устройстве в течение определенного периода</li>
                        </ul>

                        <h2>6. Обновление Политики</h2>
                        <p>Мы можем периодически обновлять данную Политику. При внесении существенных изменений мы уведомим вас об этом на нашем сайте.</p>

                        <div itemscope itemtype="https://schema.org/Organization">
                            <h2>7. Контакты</h2>
                            <p>Если у вас есть вопросы относительно использования файлов cookie, пожалуйста, свяжитесь с нами:</p>
                            <p itemprop="name">ООО "БурТехСнаб"<br>
                                Email: <a href="mailto:info@burtehsnab.ru" itemprop="email">info@burtehsnab.ru</a><br>
                                Телефон: <a href="tel:+7XXXXXXXXXX" itemprop="telephone">+7 (XXX) XXX-XX-XX</a></p>
                        </div>

                        <p><em>Дата последнего обновления: <time itemprop="dateModified" datetime="2023-01-01">01 января 2023 года</time></em></p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #005792;
    margin-bottom: 20px;
    font-size: 28px;
}

h2 {
    color: #005792;
    margin: 25px 0 15px;
    font-size: 22px;
}

.cookie-policy-content {
    background-color: white;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

p {
    margin-bottom: 15px;
    line-height: 1.6;
}

ul {
    margin-bottom: 15px;
    padding-left: 20px;
}

li {
    margin-bottom: 8px;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .cookie-policy-content {
        padding: 20px;
    }
}
</style> 