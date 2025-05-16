<script setup lang="ts">
import { ref } from 'vue';
import ModalWindow from './ModalWindow.vue';

const isModalVisible = ref(false);

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};
</script>

<template>
<div class="phones phones--header">
    <a href="tel:+78122427585" class="phones__item">
        <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
        <div><span class="phones__item__number">8 812 242 75 85</span> <span class="phones__item__office">Офис-склад СПБ-Юг</span></div>
    </a>
    <a href="tel:+78122427588" class="phones__item">
        <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
        <div><span class="phones__item__number">8 812 242 75 88</span> <span class="phones__item__office">Офис-склад СПБ-Север</span></div>
    </a>
    <div class="phones__action">
        <span class="button-wrapper">
            <button @click="openModal" class="button button--blue button button--blue">
                Заказать звонок
            </button>
        </span>
    </div>
    <ModalWindow :is-visible="isModalVisible"  @close="closeModal"></ModalWindow>
</div>
</template>

<style scoped>
</style>