<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import NavigationQuick from './components/NavigationQuick.vue';
</script>

<template>
  <v-app>
    <div id="layout">
      <Header />
      <router-view/>
      <Footer />
      <NavigationQuick />
    </div>
</v-app>
</template>

<style scoped>
</style>
