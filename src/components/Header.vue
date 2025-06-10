<script setup lang="ts">
import Navigation from './Navigation.vue';
import SearchMobile from './SearchMobile.vue';
import Search from './Search.vue';
import SocialHeader from './SocialHeader.vue';
import PhonesHeader from './PhonesHeader.vue';
import LogoHeader from './LogoHeader.vue';
import Hamburger from './Hamburger.vue';
import SiteTitle from './SiteTitle.vue';
import CategoriesHeader from './CategoriesHeader.vue';
import { useHead } from '@vueuse/head';

// Микроразметка для организации
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'БурСПб',
  url: 'https://burspb.ru',
  logo: 'https://burspb.ru/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+7 (812) 123-45-67',
    contactType: 'customer service',
    areaServed: 'RU',
    availableLanguage: ['Russian']
  },
  sameAs: [
    'https://vk.com/burspb',
    'https://t.me/burspb'
  ]
};

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(organizationSchema)
    }
  ]
});
</script>

<template>
  <header class="header">

    <div class="header__topbar">
      <div class="wrapper">
        <div class="row">

            <Hamburger />

            <SiteTitle />

            <Navigation />

            <SearchMobile />

        </div>
      </div>
    </div>

    <div class="header__main">
        <div class="wrapper">
            <div class="row">

                <LogoHeader />

                <Search />

                <SocialHeader />

                <PhonesHeader />

            </div>
        </div>
    </div>

    <div class="header__categories">
        <div class="wrapper">
            <div class="row">
                <CategoriesHeader />
            </div>
        </div>
    </div>


  </header>
</template>

<style scoped>
</style>