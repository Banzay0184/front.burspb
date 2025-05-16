<script setup lang="ts">
import NavigationMobile from './NavigationMobile.vue';
import { ref, onMounted } from 'vue';

const isMenuVisible = ref(false);
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const closeMenu = () => {
  isMenuVisible.value = false;
};
</script>

<template>
    <div class="hamburger">
        <button class="button button--hamburger" @click="toggleMenu">
            Меню
        </button>
    </div>
    <Teleport v-if="isMounted" to="#layout">
    <NavigationMobile 
      v-if="isMenuVisible" 
      @close="closeMenu"
    />
  </Teleport>
</template>

<style scoped>
</style>