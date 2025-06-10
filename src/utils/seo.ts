import type { RouteLocationNormalized } from 'vue-router';
// useHead убран - используем только DOM манипуляции
import { computed, reactive, ref } from 'vue';
import { getApiUrl } from '../api/api';

interface SeoOptions {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: any;
  ogUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}

interface BreadcrumbItem {
  title: string;
  url: string;
  position?: number;
}

// Интерфейс для SEO данных из API
interface SeoApiData {
  title: string;
  content: string;
  description?: string;
}

// Реактивное состояние для SEO данных
const seoApiData = ref<SeoApiData | null>(null);
const isLoading = ref(false);
const isLoaded = ref(false);

// Основные константы
const SITE_NAME = 'Burspb';

// Функция для получения актуального BASE_URL
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location) {
    const currentOrigin = window.location.origin;
    const baseUrl = currentOrigin.includes('localhost') ? currentOrigin : 'https://burspb.com';
    // BASE_URL определен динамически
    return baseUrl;
  }
  // BASE_URL (серверная сторона): https://burspb.com
  return 'https://burspb.com';
};

// Динамический BASE_URL - для разработки используем localhost, для продакшн - burspb.com
const BASE_URL = getBaseUrl();
const DEFAULT_TITLE = 'Оборудование для бурения №1 в России';
const DEFAULT_DESCRIPTION = 'Буровое оборудование - установки, долота, трубы. Качественный инструмент для бурения.';

// Глобальное состояние SEO
const seoState = reactive({
  currentTitle: '',
  currentDescription: '',
  currentCanonical: '',
  currentImage: '',
  breadcrumbs: [] as BreadcrumbItem[]
});

// Статичные описания для страниц (оптимизированы для SEO - до 160 символов)
const PAGE_DESCRIPTIONS = {
  '/': 'Буровое оборудование - установки, долота, трубы. Качественный инструмент для бурения скважин.',
  '/catalog': 'Каталог бурового оборудования - установки, долота, насосы, трубы. Широкий ассортимент качественного оборудования.',
  '/statji': 'Статьи о буровом оборудовании и технологиях бурения. Экспертные материалы от специалистов.',
  '/garantiya': 'Гарантийные обязательства ГК Буровые технологии. Условия обслуживания и сроки действия гарантии.',
  '/oplata': 'Способы оплаты заказов - наличный и безналичный расчет, банковские карты, рассрочка.',
  '/dostavka': 'Доставка бурового оборудования по России транспортными компаниями. Самовывоз из СПб.',
  '/o-kompanii': 'ГК Буровые технологии - надежный поставщик оборудования для бурения. Многолетний опыт работы.',
  '/kontakty': 'Контакты ГК Буровые технологии - адреса офисов в СПб, телефоны отделов продаж и техподдержки.',
  '/basket': 'Корзина товаров - оформление заказа на буровое оборудование. Расчет доставки и способы оплаты.',
  '/search': 'Поиск по каталогу бурового оборудования. Найдите нужное оборудование по названию или артикулу.',
  '/policy': 'Политика конфиденциальности ГК Буровые технологии. Правила обработки персональных данных.',
  '/terms': 'Пользовательское соглашение burspb.com. Условия использования интернет-магазина.',
  '/cookie-policy': 'Политика использования cookie файлов. Типы cookie и цели обработки данных.',
  
  // Категории товаров (из SEO отчета)
  '/catalog/category-gidromolot-urb-2a2': 'Гидромолот УРБ-2А2 - профессиональное буровое оборудование. Технические характеристики, цены, доставка.',
  '/catalog/category-obsadnye-truby': 'Обсадные трубы для бурения скважин. Широкий ассортимент диаметров, качественная сталь, доставка.',
  '/catalog/category-burovye-dolota': 'Буровые долота - профессиональный инструмент для бурения. Различные типы, размеры, гарантия качества.',
  '/catalog/category-burovoj-instrument': 'Буровой инструмент - долота, штанги, коронки. Профессиональное оборудование для бурения скважин.',
  
  // Продукты (из SEO отчета)
  '/catalog/product-bentonit-bentolux-horizont-un': 'Бентонит Bentolux Horizont UN - буровой раствор для горизонтального бурения. Характеристики, цена.',
  '/catalog/product-burovoj-zamok-z-50-mbtsu': 'Буровой замок З-50 МБТСУ - соединительный элемент для буровых штанг. Технические характеристики.',
  '/catalog/product-doloto-iii-lopastnoe-d100-z-63-5n-usilennoe': 'Долота III лопастное D100 З-63.5Н усиленное - профессиональный буровой инструмент. Цена, характеристики.'
};

/**
 * Загрузка SEO данных из API
 */
export const loadSeoData = async (): Promise<void> => {
  if (isLoading.value || isLoaded.value) {
    return;
  }
  
  // Дополнительная защита от двойного вызова
  if (typeof window !== 'undefined' && (window as any)._seoDataLoading) {
    return;
  }
  
  (window as any)._seoDataLoading = true;
  isLoading.value = true;
  
  try {
    const apiUrl = getApiUrl('block/seo');
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data.title && data.content) {
      // Извлекаем description из content (первый параграф без HTML тегов)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.content;
      const firstParagraph = tempDiv.querySelector('p');
      const description = firstParagraph ? firstParagraph.textContent?.trim() || '' : '';
      
      seoApiData.value = {
        title: data.title,
        content: data.content,
        description: description.length > 120 ? description : undefined
      };
      
      // SEO данные загружены из API
    }
    
    isLoaded.value = true;
  } catch (error) {
    console.error('❌ SEO: Ошибка загрузки данных из API:', error);
    isLoaded.value = true; // Помечаем как загруженное, чтобы не пытаться снова
  } finally {
    isLoading.value = false;
    if (typeof window !== 'undefined') {
      (window as any)._seoDataLoading = false;
    }
  }
};

/**
 * Получение названий страниц без повторяющегося суффикса
 */
const PAGE_TITLES = {
  '/': 'Главная',
  '/catalog': 'Каталог',
  '/statji': 'Статьи',
  '/garantiya': 'Гарантия',
  '/oplata': 'Оплата',
  '/dostavka': 'Доставка',
  '/o-kompanii': 'О компании',
  '/kontakty': 'Контакты',
  '/basket': 'Корзина',
  '/search': 'Поиск',
  '/policy': 'Политика конфиденциальности',
  '/terms': 'Пользовательское соглашение',
  '/cookie-policy': 'Политика использования cookie'
};

/**
 * Получение подходящего описания для страницы
 */
export const getPageDescription = (path: string, customDescription?: string): string => {
  if (customDescription && customDescription.length > 0) {
    return customDescription;
  }
  
  // Защита от undefined path
  if (!path || typeof path !== 'string') {
    return DEFAULT_DESCRIPTION;
  }
  
  // Для главной страницы используем данные из API, если есть, но укорачиваем до 160 символов
  if (path === '/' && seoApiData.value?.description && seoApiData.value.description.length >= 100) {
    // Укорачиваем длинное API описание до SEO-оптимальной длины (160 символов)
    const shortDescription = 'Буровое оборудование - установки, долота, трубы. Качественный инструмент для бурения.';
    return shortDescription;
  }
  
  // Проверяем точное совпадение со статическими описаниями
  const staticDescription = PAGE_DESCRIPTIONS[path as keyof typeof PAGE_DESCRIPTIONS];
  if (staticDescription) {
    return staticDescription;
  }
  
  // Проверяем паттерны для динамических страниц
  if (path.includes('/catalog/category-') || path.includes('/catalog/selection-')) {
    const parts = path.split('/');
    const categorySlug = parts[2]; // category-xxx или selection-xxx
    const categoryName = categorySlug?.replace(/^(category-|selection-)/, '').replace(/-/g, ' ');
    
    if (categoryName) {
      const description = `Каталог "${categoryName}" - профессиональное буровое оборудование. Широкий ассортимент инструмента для бурения с гарантией.`;
      return description;
    }
  }
  
  if (path.includes('/catalog/product-')) {
    const parts = path.split('/catalog/product-');
    const productSlug = parts[1];
    const productName = productSlug?.replace(/-/g, ' ');
    
    if (productName) {
      const description = `Купить ${productName} - профессиональное буровое оборудование. Технические характеристики, цены, гарантия производителя.`;
      return description;
    }
  }
  
  if (path.includes('/statji/')) {
    const description = 'Статья о буровом оборудовании и технологиях бурения скважин. Экспертные советы и рекомендации от специалистов ГК Буровые технологии.';
    return description;
  }
  
  return DEFAULT_DESCRIPTION;
};

/**
 * Получение подходящего заголовка для страницы
 */
export const getPageTitle = (path: string, customTitle?: string): string => {
  if (customTitle && customTitle.length > 0 && typeof customTitle === 'string') {
    // Если заголовок уже содержит суффикс, возвращаем как есть
    if (customTitle.includes('— Оборудование для бурения №1 в России') || 
        customTitle.includes('Оборудование для бурения №1 в России')) {
      return customTitle;
    }
    // Если не содержит суффикс, добавляем его
    return `${customTitle} — Оборудование для бурения №1 в России`;
  }
  
  // Защита от undefined path
  if (!path || typeof path !== 'string') {
    return DEFAULT_TITLE;
  }
  
  // Проверяем точное совпадение со статическими заголовками
  const staticTitle = PAGE_TITLES[path as keyof typeof PAGE_TITLES];
  if (staticTitle) {
    return `${staticTitle} — Оборудование для бурения №1 в России`;
  }
  
  // Для динамических страниц создаем заголовки на основе URL
  if (path.includes('/catalog/category-') || path.includes('/catalog/selection-')) {
    const parts = path.split('/');
    const categorySlug = parts[2];
    const categoryName = categorySlug?.replace(/^(category-|selection-)/, '').replace(/-/g, ' ');
    
    if (categoryName) {
      return `${categoryName} — Оборудование для бурения №1 в России`;
    }
  }
  
  if (path.includes('/catalog/product-')) {
    const parts = path.split('/catalog/product-');
    const productSlug = parts[1];
    const productName = productSlug?.replace(/-/g, ' ');
    
    if (productName) {
      return `${productName} — Оборудование для бурения №1 в России`;
    }
  }
  
  // Если ничего не подошло, возвращаем default
  return DEFAULT_TITLE;
};

/**
 * Основная функция для настройки SEO
 */
export const useSeo = (options: SeoOptions = {}) => {
  // Получаем текущий путь для генерации заголовка и описания
  const currentPath = typeof window !== 'undefined' && window.location ? window.location.pathname : '/';
  const title = getPageTitle(currentPath, options.title);
  const description = getPageDescription(currentPath, options.description);
  
  // Текущий BASE_URL определен динамически
  
  // Всегда устанавливаем canonical URL - либо переданный, либо текущий URL страницы
  const canonical = options.canonical 
    ? (options.canonical.startsWith('http') ? options.canonical : `${BASE_URL}${options.canonical}`)
    : (typeof window !== 'undefined' && window.location ? `${getBaseUrl()}${window.location.pathname}` : BASE_URL);
    
  // Canonical URL сформирован
    
  const image = options.image || `${BASE_URL}/api/files/og-image.jpg`;
  const type = options.type || 'website';
  const keywords = options.keywords || 'буровое оборудование, инструменты для бурения, буровые долота';
  const author = options.author || 'Burspb';

  // Формируем robots содержимое
  const robotsContent = computed(() => {
    const parts = [];
    if (options.noindex) parts.push('noindex');
    else parts.push('index');
    
    if (options.nofollow) parts.push('nofollow');
    else parts.push('follow');
    
    return parts.join(', ');
  });

  // Обновляем глобальное состояние
  seoState.currentTitle = title;
  seoState.currentDescription = description;
  seoState.currentCanonical = canonical || '';
  seoState.currentImage = image;

  // Основные мета-теги
  const metaTags = [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: author },
    { name: 'robots', content: robotsContent.value },
      // Open Graph
    { property: 'og:title', content: options.ogTitle || title },
    { property: 'og:description', content: options.ogDescription || description },
    { property: 'og:type', content: type },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: `${title} - ${SITE_NAME}` },
    { property: 'og:url', content: options.ogUrl || canonical },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'ru_RU' },
      // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: `${title} - ${SITE_NAME}` }
  ];

  // Добавляем специфичные для типа контента мета-теги
  if (options.publishedTime) {
    metaTags.push({ property: 'article:published_time', content: options.publishedTime });
  }
  if (options.modifiedTime) {
    metaTags.push({ property: 'article:modified_time', content: options.modifiedTime });
  }
  if (options.section) {
    metaTags.push({ property: 'article:section', content: options.section });
  }
  if (options.tags?.length) {
    options.tags.forEach(tag => {
      metaTags.push({ property: 'article:tag', content: tag });
    });
  }

  // Ссылки - canonical всегда должен быть
  // const links = [
  //   { rel: 'canonical', href: canonical }
  // ];

  // Структурированные данные
  const scripts = [];
  if (options.structuredData) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(options.structuredData)
    });
  }

  // ВНИМАНИЕ: useHead ПОЛНОСТЬЮ ОТКЛЮЧЕН из-за проблем с контекстом Vue  
  // Все мета-теги обновляются только через прямые DOM манипуляции
  
  // Обновляем все мета-теги через прямые DOM манипуляции
  if (typeof document !== 'undefined') {
    // Обновляем title
    document.title = title;
    
    // Функция для обновления или создания мета-тега
    const updateOrCreateMeta = (selector: string, content: string, property?: string, name?: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) meta.setAttribute('property', property);
        if (name) meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Базовые мета-теги
    updateOrCreateMeta('meta[name="description"]', description, undefined, 'description');
    updateOrCreateMeta('meta[name="keywords"]', keywords, undefined, 'keywords');
    updateOrCreateMeta('meta[name="author"]', author, undefined, 'author');
    updateOrCreateMeta('meta[name="robots"]', robotsContent.value, undefined, 'robots');
    
    // Open Graph теги
    updateOrCreateMeta('meta[property="og:title"]', options.ogTitle || title, 'og:title');
    updateOrCreateMeta('meta[property="og:description"]', options.ogDescription || description, 'og:description');
    updateOrCreateMeta('meta[property="og:type"]', type, 'og:type');
    updateOrCreateMeta('meta[property="og:image"]', image, 'og:image');
    updateOrCreateMeta('meta[property="og:url"]', options.ogUrl || canonical, 'og:url');
    updateOrCreateMeta('meta[property="og:site_name"]', SITE_NAME, 'og:site_name');
    updateOrCreateMeta('meta[property="og:locale"]', 'ru_RU', 'og:locale');
    
    // Twitter Card теги
    updateOrCreateMeta('meta[name="twitter:card"]', 'summary_large_image', undefined, 'twitter:card');
    updateOrCreateMeta('meta[name="twitter:title"]', title, undefined, 'twitter:title');
    updateOrCreateMeta('meta[name="twitter:description"]', description, undefined, 'twitter:description');
    updateOrCreateMeta('meta[name="twitter:image"]', image, undefined, 'twitter:image');
    
    // Специфичные теги для статей
    if (options.publishedTime) {
      updateOrCreateMeta('meta[property="article:published_time"]', options.publishedTime, 'article:published_time');
    }
    if (options.modifiedTime) {
      updateOrCreateMeta('meta[property="article:modified_time"]', options.modifiedTime, 'article:modified_time');
    }
    if (options.section) {
      updateOrCreateMeta('meta[property="article:section"]', options.section, 'article:section');
    }
    
    // Обновляем canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);
    
    // Добавляем структурированные данные
    if (options.structuredData) {
      // Удаляем старые JSON-LD скрипты для этого типа
      const existingJsonLd = document.querySelectorAll('script[type="application/ld+json"]');
      existingJsonLd.forEach(script => {
        const content = script.textContent;
        if (content && typeof content === 'string' && content.includes(options.structuredData['@type'])) {
          script.remove();
        }
      });
      
      // Добавляем новый JSON-LD
      const jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.textContent = JSON.stringify(options.structuredData);
      document.head.appendChild(jsonLdScript);
    }
    
    // Все мета-теги обновлены через DOM
  }

  return { 
    title, 
    description, 
    canonical: canonical || '',
    image,
    updateBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {
      seoState.breadcrumbs = breadcrumbs;
    }
  };
};

/**
 * Создание хлебных крошек в формате Schema.org
 */
export const createBreadcrumbsSchema = (breadcrumbs: BreadcrumbItem[]) => {
  if (!breadcrumbs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": crumb.position || index + 1,
      "name": crumb.title,
      "item": crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`
    }))
  };
};

/**
 * Создание схемы для товара
 */
export const createProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  price?: string;
  currency?: string;
  availability?: boolean;
  sku?: string;
  brand?: string;
  category?: string;
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || SITE_NAME
    }
  };

  if (product.sku) {
    schema.sku = product.sku;
  }

  if (product.category) {
    schema.category = product.category;
  }

  if (product.price) {
    schema.offers = {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || "RUB",
      "availability": product.availability ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    };
  }

  return schema;
};

/**
 * Создание схемы для статьи
 */
export const createArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  section?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image.startsWith('http') ? article.image : `${BASE_URL}${article.image}`,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/api/files/logo.png`
      }
    },
    "datePublished": article.publishedTime,
    "dateModified": article.modifiedTime || article.publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== 'undefined' && window.location ? window.location.href : BASE_URL
    },
    ...(article.section && { "articleSection": article.section })
  };
};

/**
 * Создание схемы для организации
 */
export const createOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": BASE_URL,
    "logo": `${BASE_URL}/api/files/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7-xxx-xxx-xx-xx",
      "contactType": "customer service"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RU"
    }
  };
};

/**
 * Создание схемы для веб-сайта
 */
export const createWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": BASE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * Обновление заголовка страницы в зависимости от роута
 */
export const updatePageTitle = (route: RouteLocationNormalized) => {
  const baseTitle = route.meta?.title as string || DEFAULT_TITLE;
  const description = route.meta?.description as string;
  const keywords = route.meta?.keywords as string;
  
  document.title = baseTitle;
  seoState.currentTitle = baseTitle;
  
  // Обновляем description если он есть
  if (description) {
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', description);
    }
  }
  
  // Обновляем keywords если они есть
  if (keywords) {
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.setAttribute('content', keywords);
  }
};

/**
 * Получить текущее состояние SEO
 */
export const getSeoState = () => seoState;

/**
 * Получение OG изображения для категории на основе карточек
 */
export const getCategoryOgImage = (cardsList: any[], categorySlug: string): string => {
  if (cardsList.length > 0 && cardsList[0].image) {
    return cardsList[0].image.startsWith('http') 
      ? cardsList[0].image 
      : `${BASE_URL}${cardsList[0].image}`;
  }
  return `${BASE_URL}/api/files/og-image-${categorySlug}.jpg`;
};

/**
 * Определение типа Open Graph на основе типа страницы
 */
export const getOpenGraphType = (pageType: 'website' | 'article' | 'product' = 'website'): string => {
  const typeMap = {
    'website': 'website',
    'article': 'article',
    'product': 'product'
  };
  
  return typeMap[pageType] || 'website';
};

/**
 * Обработка SEO для страниц с пагинацией
 * Правильно обрабатывает Open Graph теги для страниц пагинации
 */
export const handlePaginationSeo = (
  basePath: string, 
  currentPage: number, 
  baseTitle: string,
  baseDescription: string
) => {
  const isFirstPage = currentPage <= 1;
  
  // Канонический URL всегда указывает на первую страницу (без /page/X)
  const currentBaseUrl = getBaseUrl();
  const canonicalUrl = `${currentBaseUrl}${basePath}`;
  
  if (isFirstPage) {
    return {
      title: baseTitle,
      description: baseDescription,
      canonical: canonicalUrl,
      noindex: false,
      nofollow: false
    };
  } else {
    return {
      title: `${baseTitle} - Страница ${currentPage}`,
      description: `${baseDescription} Страница ${currentPage}.`,
      canonical: canonicalUrl, // Канонический URL всегда указывает на первую страницу
      noindex: true,
      nofollow: false
    };
  }
};

/**
 * Генерация канонического URL с правильной обработкой параметров
 */
export const generateCanonicalUrl = (fullPath: string): string => {
  try {
    // Убираем /page/X из пути для канонического URL
    const cleanPath = fullPath.replace(/\/page\/\d+$/, '');
    // Получаем актуальный BASE_URL для текущего окружения
    const currentBaseUrl = getBaseUrl();
    return `${currentBaseUrl}${cleanPath}`;
  } catch (error) {
    console.error('Error generating canonical URL:', error);
    const currentBaseUrl = getBaseUrl();
    return `${currentBaseUrl}${fullPath.split('?')[0]}`;
  }
};

/**
 * Функция для настройки SEO с учетом пагинации
 * Правильно обрабатывает Open Graph теги для страниц пагинации
 */
export const useSeoWithPagination = (options: SeoOptions & {
  currentPage?: number;
  basePath?: string;
} = {}) => {
  const { currentPage = 1, basePath = '/', ...seoOptions } = options;
  
  // Генерируем каноническую ссылку (всегда без параметров страницы)
  const canonicalPath = basePath.replace(/\/page\/\d+$/, '');
  const currentBaseUrl = getBaseUrl();
  const canonicalUrl = `${currentBaseUrl}${canonicalPath}`;
  
  // SEO Pagination настроена
  
  // Для страниц пагинации (не первая страница)
  if (currentPage > 1) {
    const title = seoOptions.title 
      ? `${seoOptions.title} - Страница ${currentPage}` 
      : `${DEFAULT_TITLE} - Страница ${currentPage}`;
    
    return useSeo({
      ...seoOptions,
    title,
      canonical: canonicalUrl, // Передаем полный URL
      // Open Graph URL всегда указывает на каноническую страницу (первую)
      ogUrl: canonicalUrl,
      noindex: true, // не индексируем страницы пагинации
      nofollow: false // но разрешаем следование по ссылкам
    });
  }
  
  // Для первой страницы
  return useSeo({
    ...seoOptions,
    canonical: canonicalUrl, // Передаем полный URL
    // Open Graph URL совпадает с канонической ссылкой
    ogUrl: canonicalUrl
  });
}; 