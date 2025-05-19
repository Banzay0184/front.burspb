<script setup lang="ts">
interface BreadcrumbItem {
  title: string;
  url?: string;
}

defineProps<{
  items?: BreadcrumbItem[];
}>();
</script>

<template>
<nav class="breadcrumbs">
  <ul itemtype="http://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemtype="http://schema.org/ListItem"><a href="/" class="nuxt-link-active">Главная</a> <meta itemprop="position" content="1" /></li>
      
      <!-- Динамические хлебные крошки -->
      <template v-if="items && items.length > 0">
        <li 
          v-for="(item, index) in items" 
          :key="index" 
          itemprop="itemListElement" 
          itemtype="http://schema.org/ListItem"
        >
          <a v-if="item.url" :href="item.url" itemprop="item">{{ item.title }}</a>
          <span v-else>{{ item.title }}</span>
          <meta itemprop="position" :content="index + 2" />
        </li>
      </template>
      
      <!-- Дефолтная крошка для каталога, если нет других -->
      <li v-else itemprop="itemListElement" itemtype="http://schema.org/ListItem">
        <a itemprop="item">Каталог</a>
        <meta itemprop="position" content="2" />
      </li>
  </ul>
</nav>
</template>

<style lang="scss" scoped>
.breadcrumbs {
  width:100%;
  margin-bottom:1.5rem;
  line-height:1
}
@media screen and (min-width:768px) {
  .breadcrumbs {
    margin-bottom:4.5rem
  }
}
.breadcrumbs ul li {
  display:inline-block;
  margin-right:.45rem
}
.breadcrumbs ul li:after {
  content:"→";
  margin-left:.75rem
}
.breadcrumbs ul li:last-child {
  margin-right:0;
  font-weight:600
}
.breadcrumbs ul li:last-child:after {
  margin-left:0;
  content:""
}
</style>