<script setup lang="ts">
defineOptions({
  name: 'Pagination'
})
</script>


<template>
<nav>
    <ul class="pagination">
        <li class="pagination__item pagination__item--prev pagination__item--prev--inactive">
            <span>
                ←
            </span>
        </li>
        <li class="pagination__item">
            <span class="pagination__item__active"><strong>1</strong></span>
        </li>
        <li class="pagination__item">
            <a href="/catalog/2" class="">
                2
            </a>
        </li>
        <li class="pagination__item">
            <a href="/catalog/3" class="">
                3
            </a>
        </li>
        <li class="pagination__item pagination__item--empty">
            <span>
                ...
            </span>
        </li>
        <li class="pagination__item">
            <a href="/catalog/24" class="">
                24
            </a>
        </li>
        <li class="pagination__item pagination__item--next">
            <a href="/catalog/2" class="">
                →
            </a>
        </li>
    </ul>
</nav>
</template>

<style lang="scss" scoped>

</style>