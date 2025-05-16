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