<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHead } from '@vueuse/head';
import apiService from '../api/api';

interface GratitudeItem {
  icon: string;
  title: string;
  description: string;
}

const gratitudeItems = ref<GratitudeItem[]>([]);
const mainImage = ref('');
const mainTitle = ref('');
const mainContent = ref('');
const isLoading = ref(true);
const hasError = ref(false);

const fetchGratitudeData = async () => {
  isLoading.value = true;
  hasError.value = false;
  
  try {
    const response = await apiService.blocks.getGratitude();
    
    if (response.data) {
      if (Array.isArray(response.data.list)) {
        gratitudeItems.value = response.data.list.map((item: any) => ({
          icon: item.image?.webp_full || item.image?.full || '',
          title: item.title || '',
          description: item.description || ''
        }));
      }
      
      mainImage.value = response.data.image?.webp_full || response.data.image?.full || '/image/44b0dc.webp';
      mainTitle.value = response.data.title || 'Спасибо за доверие';
      mainContent.value = response.data.content || '';
    } else {
      hasError.value = true;
    }
  } catch (error) {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Создаем микроразметку для благодарностей и отзывов
const gratitudeSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: mainTitle.value,
  description: mainContent.value || 'Благодарности и отзывы клиентов компании БурСПб',
  mainEntity: {
    '@type': 'Organization',
    name: 'ООО ГК "Буровые Технологии"',
    founder: {
      '@type': 'Person',
      name: 'Максим Жарнов',
      jobTitle: 'Генеральный директор'
    },
    review: gratitudeItems.value.map(item => ({
      '@type': 'Review',
      name: item.title,
      reviewBody: item.description,
      author: {
        '@type': 'Organization',
        name: 'Клиент БурСПб'
      }
    }))
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(gratitudeSchema.value)
    }
  ]
});

onMounted(() => {
  fetchGratitudeData();
});
</script>

<template>
    <section v-if="!isLoading && !hasError" class="section gratitude">
        <div class="row">
            <div class="col col--left gratitude__main">
                <div class="gratitude__main__image">
                    <img 
                        :src="mainImage" 
                        width="150" 
                        height="165" 
                        alt="gratitude" 
                        loading="lazy" 
                    />
                </div>
                <div class="gratitude__main__content">
                    <h3 class="gratitude__title">{{ mainTitle }}</h3>
                    <div v-if="mainContent" v-html="mainContent"></div>
                    <div v-else>
                        <p>Много полезной информации связанной с буровыми установками и инструментом для бурения вы можете найти в нашем разделе "Статьи"</p>
                        <p>
                            Дорогие друзья! Спасибо за выбор нашей компании, как поставщика буровых установок и инструмента. Мы ради сотрудничеству и надеемся, что у нас получится выстроить крепкие партнерские отношения на долгие годы.
                        </p>
                        <p>Каждый день мы стараемся сделать так, чтобы сотрудничество с нами было удобным. Для того, чтобы начать работать с нами, вам не нужно приезжать в офис для оформления заказа.</p>
                        <p>
                            Достаточно просто выбрать необходимое оборудование или инструмент на сайте и оформить заказ онлайн. А если у вас возникают вопросы или требуется консультация, наши специалисты с удовольствием проконсультируют
                            вас любым удобным способом коммуникации.
                        </p>
                        <p>Спасибо за доверие!</p>
                        <p>
                            Генеральный директор <span> ООО ГК "Буровые Технологии" <strong>Максим Жарнов</strong></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="col col--right gratitude__list">
                <ul v-if="gratitudeItems.length > 0">
                    <li v-for="(item, index) in gratitudeItems" :key="index">
                        <div class="gratitude__list__item">
                            <div class="gratitude__list__item__icon">
                                <img 
                                    :src="item.icon" 
                                    width="50" 
                                    height="73" 
                                    :alt="`gratitude-list-0${index + 1}`" 
                                    loading="lazy" 
                                />
                            </div>
                            <div class="gratitude__list__item__content">
                                <h3 class="slider__list__item__content__title">{{ item.title }}</h3>
                                <p class="slider__list__item__content__description">{{ item.description }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>