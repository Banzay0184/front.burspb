<script setup lang="ts">
interface CategoryItem {
  title: string;
  url: string;
}

defineProps<{
  items: CategoryItem[];
  title?: string;
}>();
</script>

<template>
  <section class="section category-nested">
    <h2 v-if="title" class="section-title">{{ title }}</h2>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <a :href="item.url">{{ item.title }}</a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.category-nested ul {
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  margin-left:-.75rem;
  margin-right:-.75rem
}
.category-nested li {
  position:relative;
  width:100%;
  min-height:5rem;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:flex-start;
  flex-wrap:wrap;
  padding:.75rem;
  margin:.75rem;
  background:#f1f3f6;
  font-size:1.2rem;
  font-weight:600;
  border-radius:.4rem;
  line-height:1.2;
  transition:all .35s ease
}
.category-nested li a {
  position:relative;
  display:block;
  width:100%
}
.category-nested li:after {
  position:absolute;
  top:50%;
  right:.75rem;
  transform:translateY(-50%);
  display:inline-block;
  content:"⟶";
  transition:all .35s ease
}
.category-nested li:hover {
  background:#bcc0d0
}
.category-nested li:hover:after {
  transform:translate(-.5rem,-50%)
}
@media screen and (min-width:480px) {
  .category-nested li {
    width:calc(50% - 1.5rem)
  }
}
@media screen and (min-width:728px) {
  .category-nested li {
    font-size:1.4rem;
    padding:1.5rem
  }
}
@media screen and (min-width:1200px) {
  .category-nested li {
    font-size:1.6rem;
    padding:2.25rem
  }
  .category-nested li:after {
    right:2.25rem
  }
}

</style>