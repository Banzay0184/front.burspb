<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../api/api';

interface BenefitItem {
  icon: string;
  alt: string;
  title: string;
  description: string;
}

const benefits = ref<BenefitItem[]>([]);
const isLoading = ref(true);
const hasError = ref(false);

const fetchBenefits = async () => {
  isLoading.value = true;
  hasError.value = false;
  
  try {
    const response = await apiService.blocks.getBenefits();
    
    if (response.data && Array.isArray(response.data.content)) {
      benefits.value = response.data.content.map((item: any) => ({
        icon: item.image?.webp_full || item.image?.full || '',
        alt: item.image?.alt?.title || `benefits-item`,
        title: item.title || '',
        description: item.description || ''
      }));
      
    } else {
      hasError.value = true;
    }
  } catch (error) {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchBenefits();
});
</script>

<template>
    <section v-if="!isLoading && !hasError && benefits.length > 0" class="section benefits">
        <ul>
        <li v-for="(benefit, index) in benefits" :key="index">
            <div class="benefits__item">
            <div class="benefits__item__icon">
                <img 
                :src="benefit.icon" 
                width="56" 
                height="81" 
                :alt="benefit.alt" 
                loading="lazy" 
                />
            </div>
            <div class="benefits__item__content">
                <h3 class="benefits__item__content__title">{{ benefit.title }}</h3>
                <p class="benefits__item__content__description">{{ benefit.description }}</p>
            </div>
            </div>
        </li>
        </ul>
    </section>
</template>

<style scoped>
</style>