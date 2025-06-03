import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useMetaTags = () => {
  const route = useRoute()
  const canonicalUrl = ref('')
  const isPaginationPage = ref(false)

  const updateMetaTags = () => {
    // Проверяем, является ли текущий путь страницей пагинации
    isPaginationPage.value = /\/page\/\d+$/.test(route.path)
    
    // Формируем канонический URL
    if (isPaginationPage.value) {
      // Удаляем часть /page/X из URL
      canonicalUrl.value = route.path.replace(/\/page\/\d+$/, '')
    } else {
      canonicalUrl.value = route.path
    }

    // Обновляем мета-теги
    updateHeadTags()
  }

  const updateHeadTags = () => {
    // Удаляем существующие мета-теги
    const existingCanonical = document.querySelector('link[rel="canonical"]')
    const existingRobots = document.querySelector('meta[name="robots"]')
    
    if (existingCanonical) {
      existingCanonical.remove()
    }
    if (existingRobots) {
      existingRobots.remove()
    }

    // Добавляем канонический тег
    const canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    canonicalLink.href = window.location.origin + canonicalUrl.value
    document.head.appendChild(canonicalLink)

    // Добавляем robots meta тег для страниц пагинации
    if (isPaginationPage.value) {
      const robotsMeta = document.createElement('meta')
      robotsMeta.name = 'robots'
      robotsMeta.content = 'noindex, follow'
      document.head.appendChild(robotsMeta)
    }
  }

  // Следим за изменениями маршрута
  watch(
    () => route.path,
    () => {
      updateMetaTags()
    },
    { immediate: true }
  )

  return {
    canonicalUrl,
    isPaginationPage,
    updateMetaTags
  }
} 