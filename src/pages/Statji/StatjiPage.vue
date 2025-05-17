<script setup lang="ts">
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Pagination from '../../components/Pagination.vue';
import Cards from './components/Cards.vue';

</script>

<template>
  <div class="main">
    <div class="wrapper category-posts">

      <Breadcrumbs />

      <section class="section recent-posts">
        <div class="section-title">
          <h3 class="section-title-tag">Все статьи</h3>
        </div>

        <Cards />

        <Pagination />

      </section>

    </div>
  </div>

</template>

<style lang="scss" scoped>
.categories-full>ul>li {
  margin-bottom: 3rem;
  position: relative
}

.categories-full>ul>li li {
  padding-left: 5.3rem;
  margin-bottom: .75rem
}

@media screen and (max-width:1199.99px) {
  .categories-full>ul>li>ul {
    display: none
  }

  .categories-full>ul>li.active>ul {
    display: block
  }
}

.categories-full__parent {
  font-weight: 700;
  display: flex;
  flex-direction: row;
  line-height: 1.2
}

.categories-full__parent span {
  min-width: 3.8rem;
  max-width: 3.8rem;
  flex-basis: 3.8rem;
  margin-right: 1.5rem
}

.categories-full__parent span img,
.categories-full__parent span svg {
  width: 100%;
  height: auto
}

.categories-full__parent span .icon-background {
  fill: #0cf
}

@media screen and (max-width:1199.999px) {
  .categories-full__parent__mobile-action {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 2rem;
    height: 2rem;
    border: thin solid #aaa;
    border-radius: 50%;
    cursor: pointer
  }

  .categories-full__parent__mobile-action:before {
    line-height: 1;
    content: "";
    font-family: FontAwesome;
    font-size: 1rem;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #aaa
  }

  .active .categories-full__parent__mobile-action:before {
    transform: translate(-50%, -50%) rotate(180deg)
  }
}

@media screen and (min-width:768px) {
  .categories-full>ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: -2.25rem;
    margin-right: -2.25rem
  }

  .categories-full>ul>li {
    display: block;
    width: calc(50% - 4.5rem);
    margin-left: 2.25rem;
    margin-right: 2.25rem
  }
}

@media screen and (min-width:1200px) {
  .categories-full>ul {
    margin-left: -1.5rem;
    margin-right: -1.5rem
  }

  .categories-full>ul>li {
    width: calc(25% - 3rem);
    margin-left: 1.5rem;
    margin-right: 1.5rem
  }
}
</style>