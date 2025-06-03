export interface MetaTags {
  title: string;
  description: string;
  image: string;
}

export const updateMetaTags = (meta: MetaTags): void => {
  // Обновляем title
  document.title = meta.title;

  // Обновляем или создаем meta теги
  const updateOrCreateMetaTag = (name: string, content: string): void => {
    let metaTag = document.querySelector(`meta[property="${name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', name);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  };

  // Обновляем OG теги
  updateOrCreateMetaTag('og:title', meta.title);
  updateOrCreateMetaTag('og:description', meta.description);
  updateOrCreateMetaTag('og:image', meta.image);

  // Обновляем стандартные meta теги
  updateOrCreateMetaTag('description', meta.description);
}; 