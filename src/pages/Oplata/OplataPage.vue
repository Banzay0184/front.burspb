<script setup lang="ts">
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';

    defineOptions({
      name: 'OplataPage.vue'
    })
</script>

<template>
<main class="main">
    <div class="wrapper">
       <Breadcrumbs />

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