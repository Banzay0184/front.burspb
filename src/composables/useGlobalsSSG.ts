import { ref } from 'vue';
import apiService from '../api/api';

// Состояние для globals данных
const globalsData = ref<any>({});
const globalsLoaded = ref(false);
const globalsError = ref<string | null>(null);

// Функция для получения SSG данных
const getSSGGlobalsData = () => {
  if (typeof window !== 'undefined' && (window as any).__INITIAL_STATE__) {
    try {
      let initialState = (window as any).__INITIAL_STATE__;
      if (typeof initialState === 'string') {
        initialState = JSON.parse(initialState);
      }
      return initialState.globals || {};
    } catch (err) {
      console.warn('⚠️ Ошибка парсинга globals SSG:', err);
      return {};
    }
  }
  return {};
};

// Основная функция для загрузки globals данных
export const useGlobalsSSG = () => {
  const loadGlobals = async () => {
    // Если данные уже загружены, возвращаем их
    if (globalsLoaded.value) {
      return globalsData.value;
    }

    try {
      // Проверяем SSG данные
      const ssgData = getSSGGlobalsData();
      
      if (ssgData && Object.keys(ssgData).length > 0) {
        globalsData.value = ssgData;
        globalsLoaded.value = true;
        return globalsData.value;
      }

      // Если SSG данных нет, делаем API запрос
      const response = await apiService.getGlobals();
      
      if (response.data) {
        globalsData.value = response.data;
        globalsLoaded.value = true;
        return globalsData.value;
      }
    } catch (error) {
      globalsError.value = error instanceof Error ? error.message : 'Ошибка загрузки globals';
      console.error('❌ Ошибка загрузки globals данных:', error);
      
      // Возвращаем пустой объект для работы приложения
      globalsData.value = {};
      globalsLoaded.value = true;
      return globalsData.value;
    }

    return globalsData.value;
  };

  return {
    globalsData,
    globalsLoaded,
    globalsError,
    loadGlobals
  };
}; 