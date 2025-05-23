<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../api/api';

interface SocialItem {
  title: string;
  url: string;
  icon: string;
}

const socialLinks = ref<SocialItem[]>([
  {
    title: 'Email',
    url: 'mailto:info@burspb.com',
    icon: 'fa fa-envelope'
  },
  {
    title: 'Telegram',
    url: 'https://t.me/bur_spb',
    icon: 'fa fa-telegram'
  },
  {
    title: 'Whatsapp',
    url: 'https://api.whatsapp.com/send?phone=79213162621',
    icon: 'fa fa-whatsapp'
  }
]);

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    if (response.data && response.data.social && Array.isArray(response.data.social)) {
      socialLinks.value = response.data.social;
    }
  } catch (error) {
  }
};

onMounted(() => {
  fetchGlobalData();
});
</script>

<template>
    <div class="social social--header">
        <ul>
            <li v-for="(link, index) in socialLinks" :key="index" class="social__item">
                <a :href="link.url" target="_blank">
                    <span class="social__item__icon"><i :class="link.icon"></i></span> 
                    <span class="social__item__title">{{ link.title }}</span>
                    <span class="accessibility">Вы можете связаться с нами посредством {{ link.title }}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<style scoped>
</style>