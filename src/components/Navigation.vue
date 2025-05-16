<script setup lang="ts">
</script>

<template>
  <nav class="navigation navigation--header">

    <ul itemtype="http://schema.org/SiteNavigationElement">
      <li class="navigation__item">
        <RouterLink to="/Catalog/CatalogPage" itemprop="url">
          <span class="navigation__item__icon navigation__item__icon--icon-page-1">
            <img src="/image/e93b66.svg" width="28" height="28" alt="Перейти в каталог" loading="lazy" />
          </span>
          <span class="navigation__item__title">Каталог</span>
        </RouterLink>
      </li>
      <li class="navigation__item">
        <RouterLink to="/Statji/StatjiPage" itemprop="url">
          <span class="navigation__item__icon navigation__item__icon--icon-page-7">
            <img src="/image/a16de5.svg" width="28" height="28" alt="Перейти к статьям" loading="lazy" />
          </span>
          <span class="navigation__item__title">Статьи</span>
        </RouterLink>
      </li>
      <li class="navigation__item">
        <RouterLink to="/Garantiya/GarantiyaPage" itemprop="url">
          <span class="navigation__item__icon navigation__item__icon--icon-page-4">
            <img src="/image/4d5a09.svg" width="28" height="28" alt="Перейти к Гарантия" loading="lazy" />
          </span>
          <span class="navigation__item__title">Гарантия</span>
        </RouterLink>
      </li>
      <li class="navigation__item">
        <RouterLink to="/Oplata/OplataPage" itemprop="url">
          <span class="navigation__item__icon navigation__item__icon--icon-page-3">
            <img src="/image/d159ba.svg" width="28" height="28" alt="Перейти к Оплата" loading="lazy" />
          </span> 
          <span class="navigation__item__title">Оплата</span>
        </RouterLink>
      </li>
      <li class="navigation__item">
        <RouterLink to="/Dostavka/DostavkaPage" itemprop="url">
          <span class="navigation__item__icon navigation__item__icon--icon-page-2">
            <img src="/image/3ff0cd.svg" width="28" height="28" alt="Перейти к Доставка" loading="lazy" />
          </span>
          <span class="navigation__item__title">Доставка</span>
        </RouterLink>
      </li>
      <li class="navigation__item">
        <RouterLink to="/Okompanii/OkompaniiPage" itemprop="url">
          <span class="navigation__item__icon navigation__item__icon--icon-page-5">
            <img src="/image/8774d1.svg" width="28" height="28" alt="Перейти к О компании" loading="lazy" />
          </span>
          <span class="navigation__item__title">О компании</span>
        </RouterLink>
      </li>
      <li class="navigation__item">
        <RouterLink to="/Kontakty/KontaktyPage" itemprop="url" class="nuxt-link-exact-active nuxt-link-active" aria-current="page">
          <span class="navigation__item__icon navigation__item__icon--icon-page-6">
            <img src="/image/ec4772.svg" width="28" height="28" alt="Перейти к Контакты" loading="lazy" />
          </span>
          <span class="navigation__item__title">Контакты</span>
        </RouterLink>
      </li>
    </ul>
    
  </nav>
</template>

<style scoped>
</style>