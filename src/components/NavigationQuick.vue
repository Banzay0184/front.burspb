<script setup lang="ts">
</script>

<template>

  <nav class="navigation-quick">
      <ul>
          <li class="navigation-quick__item">
            <RouterLink to="/" itemprop="url" aria-current="page" class="nuxt-link-exact-active nuxt-link-active">
                <span class="navigation-quick__item__icon navigation-quick__item__icon--home"><img src="/image/26e136.svg" width="49" height="45" alt="На главную страницу" loading="lazy" /></span>
                <span class="navigation-quick__item__title">Главная</span>
            </RouterLink>
          </li>
          <li class="navigation-quick__item">
            <RouterLink to="/Catalog/CatalogPage" itemprop="url">
                <span class="navigation-quick__item__icon navigation-quick__item__icon--products"><img src="/image/b0088c.svg" width="42" height="42" alt="Перейти в каталог" loading="lazy" /></span>
                <span class="navigation-quick__item__title">Каталог</span>
            </RouterLink>
          </li>
          <li class="navigation-quick__item">
            <RouterLink to="/basket" itemprop="url">
                <span class="navigation-quick__item__icon navigation-quick__item__icon--basket"><img src="/image/6bf308.svg" width="54" height="45" alt="Перейти в корзину" loading="lazy" /> </span>
                <span class="navigation-quick__item__title">Корзина</span>
            </RouterLink>
          </li>
          <li class="navigation-quick__item">
            <RouterLink to="/Kontakty/KontaktyPage" itemprop="url">
                <span class="navigation-quick__item__icon navigation-quick__item__icon--contact"><img src="/image/4a6ec8.svg" width="46" height="46" alt="Контакты" loading="lazy" /></span>
                <span class="navigation-quick__item__title">Контакты</span>
            </RouterLink>
          </li>
      </ul>
  </nav>

  
</template>

<style scoped>
</style>