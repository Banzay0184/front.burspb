<script setup lang="ts">
import { onUnmounted } from 'vue';

const toggleSearch = () => {
  document.body.classList.toggle('m-search');
};

onUnmounted(() => {
  document.body.classList.remove('m-search');
});
</script>

<template>
  <div class="search-mobile">
    <button class="button button--search" @click="toggleSearch">
      Поиск
    </button>
  </div>
</template>

<style scoped>
</style>