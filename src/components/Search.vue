<script setup lang="ts">
</script>

<template>
    <div itemtype="http://schema.org/WebSite" class="search">
        <form itemprop="potentialAction" itemtype="http://schema.org/SearchAction">
            <meta itemprop="target" content="/search/?s=null" /> <input type="search" name="search" placeholder="Поиск по сайту" id="search" class="input input--search input--search-form" />
            <input itemprop="query-input" type="hidden" name="query" /> <button class="button button--search button--search-form"><i class="fa fa-search"></i> <span>Поиск</span></button>
        </form>
    </div>
</template>

<style scoped>
</style>