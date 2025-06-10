// Композабл для работы с предзагруженными SSG данными
export function useSSGData() {
  
  // Получаем предзагруженные данные из SSG
  const getInitialState = () => {
    if (typeof window !== 'undefined' && (window as any).__INITIAL_STATE__) {
      try {
        let initialState = (window as any).__INITIAL_STATE__;
        if (typeof initialState === 'string') {
          initialState = JSON.parse(initialState);
        }
        return initialState;
      } catch (err) {
        console.error('❌ Ошибка парсинга SSG данных:', err);
        return {};
      }
    }
    return {};
  };

  // Получаем globals данные
  const getGlobalsData = () => {
    const state = getInitialState();
    return state.globals || {};
  };

  // Получаем популярные товары
  const getPopularProducts = () => {
    const state = getInitialState();
    return state.popularProducts || [];
  };

  // Получаем статьи
  const getArticles = () => {
    const state = getInitialState();
    return state.articles || [];
  };

  // Получаем категории
  const getCategories = () => {
    const state = getInitialState();
    return state.categories || [];
  };

  // Получаем популярные блоки
  const getPopularBlocks = () => {
    const state = getInitialState();
    return state.popularBlocks || [];
  };

  // Получаем benefits блок
  const getBenefitsBlock = () => {
    const state = getInitialState();
    return state.benefitsBlock || {};
  };

  // Получаем recent posts блок
  const getRecentPostsBlock = () => {
    const state = getInitialState();
    return state.recentPostsBlock || [];
  };

  // Проверяем, есть ли данные конкретного типа
  const hasSSGData = (dataType: string) => {
    const state = getInitialState();
    return state[dataType] && state[dataType].length > 0;
  };

  return {
    getInitialState,
    getGlobalsData,
    getPopularProducts,
    getArticles,
    getCategories,
    getPopularBlocks,
    getBenefitsBlock,
    getRecentPostsBlock,
    hasSSGData
  };
} 