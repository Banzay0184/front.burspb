<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { updateMetaTags } from '../services/metaService';
import { metaConfig } from '../config/metaConfig';

const route = useRoute();

const updateMeta = () => {
  const pageKey = route.name as string;
  const meta = metaConfig[pageKey] || metaConfig.home;
  updateMetaTags(meta);
};

// Обновляем мета-теги при монтировании компонента
onMounted(() => {
  updateMeta();
});

// Следим за изменениями маршрута
watch(
  () => route.name,
  () => {
    updateMeta();
  }
);
</script>

<template>
  <!-- Этот компонент не рендерит ничего в DOM -->
</template> 