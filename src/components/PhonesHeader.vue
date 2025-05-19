<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../api/api';
import ModalWindow from './ModalWindow.vue';

const isModalVisible = ref(false);
const phone = ref('8 812 242 75 85');
const phoneAlt = ref('8 812 242 75 88');

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    if (response.data && response.data.contact) {
      phone.value = response.data.contact.phone || phone.value;
      phoneAlt.value = response.data.contact.phone_alt || phoneAlt.value;
    }
  } catch (error) {
    console.error('Ошибка при получении данных телефонов:', error);
  }
};

onMounted(() => {
  fetchGlobalData();
});
</script>

<template>
<div class="phones phones--header">
    <a :href="`tel:+${phone.replace(/\s/g, '')}`" class="phones__item">
        <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
        <div><span class="phones__item__number">{{ phone }}</span> <span class="phones__item__office">Офис-склад СПБ-Юг</span></div>
    </a>
    <a :href="`tel:+${phoneAlt.replace(/\s/g, '')}`" class="phones__item">
        <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
        <div><span class="phones__item__number">{{ phoneAlt }}</span> <span class="phones__item__office">Офис-склад СПБ-Север</span></div>
    </a>
    <div class="phones__action">
        <span class="button-wrapper">
            <button @click="openModal" class="button button--blue button button--blue">
                Заказать звонок
            </button>
        </span>
    </div>
    <ModalWindow :is-visible="isModalVisible" @close="closeModal"></ModalWindow>
</div>
</template>

<style scoped>
</style>