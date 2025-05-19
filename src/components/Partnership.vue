<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../api/api';

interface PartnershipStep {
  id: number;
  image: string;
  alt: string;
  title: string;
  description: string;
}

const steps = ref<PartnershipStep[]>([]);
const title = ref('4 простых шага для сотрудничества');
const isLoading = ref(true);
const hasError = ref(false);

const fetchPartnershipSteps = async () => {
  isLoading.value = true;
  hasError.value = false;
  
  try {
    const response = await apiService.blocks.getPartnership();
    
    if (response.data && Array.isArray(response.data.content)) {
      if (response.data.title) {
        title.value = response.data.title;
      }
      
      steps.value = response.data.content.map((item: any, index: number) => ({
        id: index + 1,
        image: item.image?.webp_full || item.image?.full || '',
        alt: item.image?.alt?.title || `partnership-step-${index + 1}`,
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
  fetchPartnershipSteps();
});
</script>

<template>
  <section v-if="!isLoading && !hasError && steps.length > 0" class="section partnership">
    <div class="section-title">
      <h3 class="section-title-tag">{{ title }}</h3>
    </div>
    <ul class="partnership__list">
      <li v-for="step in steps" :key="step.id" class="partnership__list-item">
        <div class="partnership__item">
          <div class="partnership__item__image">
            <img
              :src="step.image"
              width="177"
              height="204"
              :alt="step.alt"
              loading="lazy"
            />
          </div>
          <h3 class="partnership__item__content__title">{{ step.title }}</h3>
          <p class="partnership__item__content__description">
            {{ step.description }}
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
</style>