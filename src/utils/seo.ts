import { useHead } from '@vueuse/head';

interface SeoOptions {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}

export const useSeo = (options: SeoOptions) => {
  const baseUrl = 'https://burspb.com';
  
  // Генерация канонического URL
  const getCanonicalUrl = (path: string) => {
    // Удаляем /page/2 и подобные суффиксы из URL
    const canonicalPath = path.replace(/\/page\/\d+$/, '');
    return `${baseUrl}${canonicalPath}`;
  };

  // Установка мета-тегов
  useHead({
    title: options.title,
    meta: [
      {
        name: 'description',
        content: options.description
      },
      {
        name: 'robots',
        content: options.noindex ? 'noindex, nofollow' : 'index, follow'
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: options.canonical ? getCanonicalUrl(options.canonical) : undefined
      }
    ]
  });
}; 