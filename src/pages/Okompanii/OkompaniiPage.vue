<script setup lang="ts">
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';

defineOptions({
    name: 'Okompanii.vue'
})
</script>

<template>
<main class="main">
    <div class="wrapper">
        <Breadcrumbs />
    </div>
    <div class="wrapper">
       <Gratitude />
    </div>
</main>



</template>

<style lang="scss" scoped>
</style>