<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHead } from '@vueuse/head';
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

const getInitialData = () => {
  if (typeof window !== 'undefined' && (window as any).__INITIAL_STATE__) {
    try {
      let initialState = (window as any).__INITIAL_STATE__;
      if (typeof initialState === 'string') {
        initialState = JSON.parse(initialState);
      }
      return initialState.benefitsBlock || {};
    } catch (err) {
      // Тихо обрабатываем ошибку парсинга
      return {};
    }
  }
  return {};
};

const fetchBenefits = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    const response = await apiService.blocks.getBenefits();
    const benefitsData = response.data.content || [];
    
    // Преобразуем API данные в BenefitItem формат
    benefits.value = benefitsData.map((item: any) => ({
        icon: item.image?.webp_full || item.image?.full || '',
        alt: item.image?.alt?.title || `benefits-item`,
        title: item.title || '',
        description: item.description || ''
      }));
  } catch (error) {
    hasError.value = true;
    benefits.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Проверяем есть ли предварительно загруженные данные SSG
  const ssgData = getInitialData();
  
  if (ssgData && Array.isArray(ssgData) && ssgData.length > 0) {
    // Преобразуем SSG данные в BenefitItem формат
    benefits.value = ssgData.map((item: any) => ({
      icon: item.image?.webp_full || item.image?.full || '',
      alt: item.image?.alt?.title || `benefits-item`,
      title: item.title || '',
      description: item.description || ''
    }));
    
    isLoading.value = false;
    hasError.value = false;
  } else {
  if (typeof window !== 'undefined') {
  fetchBenefits();
    }
  }
});

// Создаем микроразметку для преимуществ компании
const benefitsSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'БурСПб',
  description: 'Компания БурСПб - лидер в области бурового оборудования',
  makesOffer: benefits.value.map(benefit => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: benefit.title,
      description: benefit.description,
      image: benefit.icon
    }
  }))
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(benefitsSchema.value)
    }
  ]
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