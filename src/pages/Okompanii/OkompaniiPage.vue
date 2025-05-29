<script setup lang="ts">
import { computed } from 'vue';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';

defineOptions({
    name: 'Okompanii.vue'
})

// Хлебные крошки
const breadcrumbs = computed(() => [
  { title: 'Главная', url: '/' },
  { title: 'О компании', url: '', isCurrent: true }
]);
</script>

<template>
<main class="main">
    <div class="wrapper">
        <Breadcrumbs :items="breadcrumbs" />
    </div>
    <div class="wrapper">
       <Gratitude />
    </div>
</main>



</template>

<style lang="scss" scoped>
</style>