import type { MetaTags } from '../services/metaService';

export const metaConfig: Record<string, MetaTags> = {
  home: {
    title: 'Главная страница',
    description: 'Описание главной страницы',
    image: 'https://your-domain.com/images/home-og.jpg'
  },
  about: {
    title: 'О нас',
    description: 'Информация о нашей компании',
    image: 'https://your-domain.com/images/about-og.jpg'
  },
  // Добавьте другие страницы по необходимости
}; 