<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { getPageDescription, loadSeoData } from '../../utils/seo';

interface PageStatus {
  url: string;
  title: string;
  status: string;
  statusType: 'indexed' | 'duplicate' | 'noindex' | 'error' | 'warning';
  lastChecked: string;
  canonical?: string;
  robotsTag?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  hasH1?: boolean;
  responseCode?: number;
  issues?: string[];
}

// const route = useRoute();
// const router = useRouter();

// Безопасное получение origin для отображения
const currentOrigin = ref('');

// Состояние компонента
const pages = ref<PageStatus[]>([]);
const isLoading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('all');
const sortBy = ref('url');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Статистика
const stats = computed(() => {
  const total = pages.value.length;
  const indexed = pages.value.filter(p => p.statusType === 'indexed').length;
  const duplicates = pages.value.filter(p => p.statusType === 'duplicate').length;
  const noindex = pages.value.filter(p => p.statusType === 'noindex').length;
  const errors = pages.value.filter(p => p.statusType === 'error').length;
  const warnings = pages.value.filter(p => p.statusType === 'warning').length;

  return {
    total,
    indexed,
    duplicates,
    noindex,
    errors,
    warnings
  };
});

// Фильтрованные страницы
const filteredPages = computed(() => {
  let filtered = pages.value;

  // Фильтр по поиску
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(page => 
      page.url.toLowerCase().includes(query) ||
      page.title.toLowerCase().includes(query) ||
      page.status.toLowerCase().includes(query)
    );
  }

  // Фильтр по статусу
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(page => page.statusType === statusFilter.value);
  }

  // Сортировка
  filtered.sort((a, b) => {
    let valueA = '';
    let valueB = '';

    switch (sortBy.value) {
      case 'url':
        valueA = a.url;
        valueB = b.url;
        break;
      case 'title':
        valueA = a.title;
        valueB = b.title;
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'lastChecked':
        valueA = a.lastChecked;
        valueB = b.lastChecked;
        break;
    }

    if (sortOrder.value === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  return filtered;
});

// Получение цвета статуса
// const getStatusColor = (statusType: string) => {
//   switch (statusType) {
//     case 'indexed':
//       return 'text-green-600 bg-green-50';
//     case 'duplicate':
//       return 'text-orange-600 bg-orange-50';
//     case 'noindex':
//       return 'text-blue-600 bg-blue-50';
//     case 'error':
//       return 'text-red-600 bg-red-50';
//     case 'warning':
//       return 'text-yellow-600 bg-yellow-50';
//     default:
//       return 'text-gray-600 bg-gray-50';
//   }
// };

// Получение иконки статуса
// const getStatusIcon = (statusType: string) => {
//   switch (statusType) {
//     case 'indexed':
//       return '✓';
//     case 'duplicate':
//       return '⚠';
//     case 'noindex':
//       return '🚫';
//     case 'error':
//       return '❌';
//     case 'warning':
//       return '⚠';
//     default:
//       return '?';
//   }
// };

// Сортировка
// const handleSort = (field: string) => {
//   if (sortBy.value === field) {
//     sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
//   } else {
//     sortBy.value = field;
//     sortOrder.value = 'asc';
//   }
// };

// Реальная проверка страницы
const checkPage = async (url: string): Promise<PageStatus> => {
  try {
    
    // ВАЖНО: Проверяем ЛОКАЛЬНЫЙ сервер, а не продакшн!
    const baseUrl = currentOrigin.value; // localhost:3001
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    // Добавляем timestamp для полного избежания кеширования
    const cacheBuster = `?_cb=${Date.now()}`;
    const finalUrl = fullUrl + cacheBuster;
    
    
    // Проверяем доступность ЛОКАЛЬНОЙ страницы с принудительным обновлением кеша
    const response = await fetch(finalUrl, {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin',
      cache: 'no-cache', // Принудительно обновляем кеш
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    const responseCode = response.status;
    const html = await response.text();
    
    // Используем регулярные выражения для анализа HTML (DOMParser не работает с Vite dev server)
    
    // Извлекаем title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const metaTitle = titleMatch ? titleMatch[1].trim() : '';
    
    // Извлекаем meta description
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    const metaDescription = descMatch ? descMatch[1].trim() : '';
    
    // Извлекаем meta robots
    const robotsMatch = html.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"[^>]*>/i);
    const metaRobots = robotsMatch ? robotsMatch[1].trim() : 'index, follow';
    
    // Извлекаем canonical URL
    const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"[^>]*>/i);
    const canonicalUrl = canonicalMatch ? canonicalMatch[1] : '';
    
    // Проверяем HTML структуру
    
    // Проверяем заголовки ответа
    
    // Проверяем наличие H1
    const h1Match = html.match(/<h1[^>]*>/i);
    const hasH1 = !!h1Match;
    
    // Анализируем проблемы
    const issues: string[] = [];
    let status = '';
    let statusType: PageStatus['statusType'] = 'indexed';

    // Проверка ответа сервера
    if (responseCode >= 400) {
      status = `Ошибка ${responseCode}`;
      statusType = 'error';
      issues.push(`HTTP ошибка: ${responseCode}`);
    } else if (responseCode >= 300) {
      status = `Редирект ${responseCode}`;
      statusType = 'warning';
      issues.push(`Редирект: ${responseCode}`);
    }

    // Анализ robots meta тега
    if (metaRobots.includes('noindex')) {
      if (url.includes('/page/')) {
        status = 'Пагинация (правильно настроена)';
        statusType = 'noindex';
      } else if (url.includes('/basket') || url.includes('/search') || url.includes('/api')) {
        status = 'Служебная страница (правильно исключена)';
        statusType = 'noindex';
      } else {
        status = 'Исключена из индексации';
        statusType = 'noindex';
        if (!url.includes('/policy') && !url.includes('/terms')) {
          issues.push('Важная страница исключена из индексации');
        }
      }
    } else {
      status = 'Индексируется';
      statusType = 'indexed';
    }

    // Проверка canonical URL для страниц пагинации
    if (url.includes('/page/')) {
      const expectedCanonical = url.replace(/\/page\/\d+$/, '');
      
      // canonical может быть относительным или абсолютным
      const canonicalPath = canonicalUrl.replace(/^https?:\/\/[^\/]+/, ''); // убираем домен если есть
      
      if (!canonicalUrl || canonicalPath !== expectedCanonical) {
        issues.push('Неправильный canonical URL для страницы пагинации');
        statusType = 'duplicate';
        status = 'Проблема с canonical';
      }
    }

    // Проверка title
    if (!metaTitle) {
      issues.push('Отсутствует title');
      statusType = statusType === 'indexed' ? 'warning' : statusType;
    } else if (metaTitle.length < 30) {
      issues.push('Слишком короткий title (менее 30 символов)');
    } else if (metaTitle.length > 60) {
      issues.push('Слишком длинный title (более 60 символов)');
    }

    // Проверка description с учетом ожидаемого описания из API/seo.ts
    const expectedDescription = getPageDescription(url);
    const shouldHaveLongDescription = expectedDescription.length >= 120;
    
    if (!metaDescription) {
      issues.push('Отсутствует meta description');
    } else if (metaDescription.length < 120 && shouldHaveLongDescription) {
      // Проверяем, соответствует ли описание ожидаемому
      if (metaDescription !== expectedDescription) {
        issues.push('Описание не соответствует настройкам SEO (возможно, страница не обновилась)');
      } else {
        issues.push('Слишком короткое описание (менее 120 символов)');
      }
    } else if (metaDescription.length > 160) {
      issues.push('Слишком длинное описание (более 160 символов)');
    }

    // Проверка H1
    if (!hasH1) {
      issues.push('Отсутствует заголовок H1');
      statusType = statusType === 'indexed' ? 'warning' : statusType;
    }

    // Финальная оценка статуса
    if (issues.length > 0 && statusType === 'indexed') {
      statusType = 'warning';
      status = `Индексируется (${issues.length} предупреждений)`;
    }

    // Анализ завершен

    return {
      url,
      title: metaTitle || 'Без заголовка',
      status,
      statusType,
      lastChecked: new Date().toLocaleString('ru-RU'),
      canonical: canonicalUrl,
      robotsTag: metaRobots,
      metaTitle,
      metaDescription,
      hasH1,
      responseCode,
      issues
    };

  } catch (error) {
    console.error(`❌ Ошибка при проверке страницы ${url}:`, error);
    
    return {
      url,
      title: 'Ошибка загрузки',
      status: 'Недоступна',
      statusType: 'error',
      lastChecked: new Date().toLocaleString('ru-RU'),
      responseCode: 0,
      issues: ['Страница недоступна для анализа']
    };
  }
};

// Сохранение данных анализа для отчета
const saveSeoAnalysisData = (pageStatuses: PageStatus[]) => {
  try {
    const analysisData = {
      totalPages: pageStatuses.length,
      indexed: pageStatuses.filter(p => p.statusType === 'indexed').length,
      duplicates: pageStatuses.filter(p => p.statusType === 'duplicate').length,
      noindex: pageStatuses.filter(p => p.statusType === 'noindex').length,
      errors: pageStatuses.filter(p => p.statusType === 'error').length,
      warnings: pageStatuses.filter(p => p.statusType === 'warning').length,
      problemPages: pageStatuses
        .filter(p => p.issues && p.issues.length > 0)
        .map(p => ({
          url: p.url,
          issue: p.issues![0], // Берем первую проблему
          status: p.status,
          canonical: p.canonical
        })),
      lastAnalysisDate: new Date().toLocaleString('ru-RU')
    };

    localStorage.setItem('seo-analysis-data', JSON.stringify(analysisData));
  } catch (error) {
    console.error('❌ Ошибка при сохранении данных анализа:', error);
  }
};

// Получение списка страниц сайта
const getSitePages = (): string[] => {
  // Базовые страницы, которые точно есть на сайте
  const basePages = [
    '/',
    '/catalog',
    '/statji',
    '/garantiya',
    '/oplata', 
    '/dostavka',
    '/o-kompanii',
    '/kontakty'
  ];

  // Страницы каталога (если доступны)
  const catalogPages = [
    '/catalog/category-gidromolot-urb-2a2',
    '/catalog/category-obsadnye-truby',
    '/catalog/category-burovye-dolota',
    '/catalog/category-burovoj-instrument'
  ];

  // Страницы пагинации
  const paginationPages = [
    '/catalog/page/2',
    '/catalog/category-gidromolot-urb-2a2/page/2',
    '/catalog/category-obsadnye-truby/page/2'
  ];

  // Служебные страницы
  const servicePages = [
    '/basket',
    '/search',
    '/policy',
    '/terms',
    '/cookie-policy'
  ];

  // Примеры товаров (если доступны)
  const productPages = [
    '/catalog/product-bentonit-bentolux-horizont-un',
    '/catalog/product-burovoj-zamok-z-50-mbtsu',
    '/catalog/product-doloto-iii-lopastnoe-d100-z-63-5n-usilennoe'
  ];

  return [
    ...basePages,
    ...catalogPages,
    ...paginationPages,
    ...servicePages,
    ...productPages
  ];
};

// Загрузка данных
const loadPages = async () => {
  isLoading.value = true;
  
  try {
    const sitePages = getSitePages();
    
    // Проверяем страницы по одной, чтобы не перегружать сервер
    const pageStatuses: PageStatus[] = [];
    
    for (const url of sitePages) {
      const pageStatus = await checkPage(url);
      pageStatuses.push(pageStatus);
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    pages.value = pageStatuses;
    
    // Анализ страниц завершен
    
    // Сохраняем данные анализа для отчета
    saveSeoAnalysisData(pageStatuses);
    
    
  } catch (error) {
    console.error('❌ Ошибка при загрузке данных SEO:', error);
    // В случае ошибки показываем хотя бы базовую информацию
    pages.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Обновление страницы
// const refreshPage = async (url: string) => {
//   const index = pages.value.findIndex(p => p.url === url);
//   if (index !== -1) {
//     const updatedPage = await checkPage(url);
//     pages.value[index] = updatedPage;
//   }
// };

// Обновление всех страниц
const refreshAll = () => {
  loadPages();
};

// Очистка всех данных и перезапуск
const clearCacheAndRestart = async () => {
  try {
    
    // Очищаем ВСЕ localStorage
    localStorage.clear();
    
    // Очищаем sessionStorage тоже
    sessionStorage.clear();
    
    // Очищаем текущие данные
    pages.value = [];
    
    // Обновляем origin
    if (typeof window !== 'undefined') {
      currentOrigin.value = window.location.origin;
    }
    
    
    // Принудительно обновляем страницу через 1 секунду
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ Ошибка при очистке данных:', error);
  }
};

// Тест одной страницы для отладки
const testSinglePage = async () => {
  
  // Тестируем главную страницу
  await checkPage('/');
  
  // Получаем ожидаемое описание
  getPageDescription('/');
  
  // Проверяем что в HTML реальной страницы с принудительным обновлением кеша
  try {
    const response = await fetch(currentOrigin.value + '/', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const html = await response.text();
    
    // Ищем canonical в HTML
    const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"[^>]*>/i);
    canonicalMatch ? canonicalMatch[1] : 'НЕ НАЙДЕН';
    
    
    // Ищем description
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    descMatch ? descMatch[1] : 'НЕ НАЙДЕН';
    
    
    // Проверяем что в HTML есть
    
    // Ищем ВСЕ canonical теги
    html.match(/<link[^>]*rel="canonical"[^>]*>/gi);
    
  } catch (error) {
    console.error('🧪 Ошибка при проверке HTML:', error);
  }
};

// Только прогрев страниц (без загрузки API)
const warmupOnly = async () => {
  try {
    isLoading.value = true;
    await warmupPages();
    await loadPages();
  } catch (error) {
    console.error('❌ Ошибка при прогреве страниц:', error);
  } finally {
    isLoading.value = false;
  }
};

// Обновление SEO данных из API
const refreshSeoData = async () => {
  try {
    await loadSeoData();
    await warmupPages(); // Прогреваем страницы для применения новых мета-тегов
    await loadPages(); // Перезапускаем анализ с новыми данными
  } catch (error) {
    console.error('❌ Ошибка при обновлении SEO данных:', error);
  }
};

// Прогрев страниц для применения новых мета-тегов
const warmupPages = async () => {
  const sitePages = getSitePages();
  
  for (const url of sitePages) {
    try {
      
      // Открываем ЛОКАЛЬНУЮ страницу в скрытом iframe для применения Vue.js SEO
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);
      
      // Ждем загрузки страницы
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 10000); // 10 секунд таймаут
        
        iframe.onload = () => {
          clearTimeout(timeout);
          setTimeout(resolve, 1000); // Даем время на применение SEO
        };
        
        iframe.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Load error'));
        };
        
        iframe.src = currentOrigin.value + url;
      });
      
      // Удаляем iframe
      document.body.removeChild(iframe);
      
      // Небольшая пауза между страницами
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.warn(`⚠️ Не удалось прогреть страницу ${url}:`, error);
    }
  }
  
};

// Экспорт данных
// const exportData = () => {
//   const csvContent = [
//     ['URL', 'Заголовок', 'Статус', 'Код ответа', 'Meta Title', 'Meta Description', 'Robots', 'Canonical', 'Проблемы'].join(','),
//     ...filteredPages.value.map(page => [
//       page.url,
//       `"${page.title}"`,
//       page.status,
//       page.responseCode || '',
//       `"${page.metaTitle || ''}"`,
//       `"${page.metaDescription || ''}"`,
//       page.robotsTag || '',
//       page.canonical || '',
//       `"${(page.issues || []).join('; ')}"`
//     ].join(','))
//   ].join('\n');

//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `seo-analysis-${new Date().toISOString().split('T')[0]}.csv`;
//   link.click();
// };

onMounted(async () => {
  // Безопасно устанавливаем origin
  if (typeof window !== 'undefined') {
    currentOrigin.value = window.location.origin;
  }
  
  // Сначала загружаем SEO данные из API
  
  // Импортируем и проверяем BASE_URL
  import('../../utils/seo').then(() => {
  });
  
  await loadSeoData();
  
  // Тестируем функцию getPageDescription для главной страницы
  getPageDescription('/');
  
  // Затем начинаем анализ ЛОКАЛЬНЫХ страниц
  await loadPages();
});
</script>

<template>
  <div class="screen">
    <!-- Простой заголовок -->
    <header class="seo-header">
      <div class="wrapper">
        <div class="seo-header__content">
          <div class="seo-header__title">
            <h1><i class="fa fa-search"></i> SEO Анализ Сайта</h1>
            <p>Проверка страниц на соответствие SEO требованиям</p>
          </div>
          <div class="seo-header__actions">
            <button 
              @click="clearCacheAndRestart"
              :disabled="isLoading"
              class="button button--red button--small"
              title="Очистить все данные и перезапустить анализ"
            >
              <i class="fa fa-trash"></i>
              Очистить кеш
            </button>
            <button 
              @click="testSinglePage"
              :disabled="isLoading"
              class="button button--yellow button--small"
              title="Тест: проверить одну страницу"
            >
              <i class="fa fa-bug"></i>
              Тест главной
            </button>
            <button 
              @click="refreshSeoData"
              :disabled="isLoading"
              class="button button--blue button--small"
              title="Обновить SEO данные из API и прогреть страницы"
            >
              <i class="fa fa-cloud-download"></i>
              {{ isLoading ? 'Прогрев...' : 'API + Прогрев' }}
            </button>
            <button 
              @click="warmupOnly"
              :disabled="isLoading"
              class="button button--blue button--small"
              title="Прогреть все страницы для применения SEO"
            >
              <i class="fa fa-fire"></i>
              Прогрев
            </button>
            <button 
              @click="refreshAll"
              :disabled="isLoading"
              class="button button--blue"
            >
              <i class="fa fa-refresh"></i>
              {{ isLoading ? 'Загрузка...' : 'Обновить' }}
            </button>
            <RouterLink 
              to="/seo-report"
              class="button button--blue button--outline"
            >
              <i class="fa fa-download"></i>
              Отчет
            </RouterLink>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="wrapper">
        <!-- Информация о локальном анализе -->
        <section class="section">
          <div class="local-info-card">
            <div class="local-info-icon">
              <i class="fa fa-desktop"></i>
            </div>
                         <div class="local-info-content">
               <h3>🏠 Локальный анализ</h3>
               <p>Анализируется <strong>локальный сервер</strong> {{ currentOrigin || 'загрузка...' }}</p>
               <p class="local-info-note">
                 <i class="fa fa-info-circle"></i>
                 Для анализа продакшн сайта burspb.com используйте внешние SEO инструменты
               </p>
             </div>
          </div>
        </section>

        <!-- Статистика -->
        <section class="section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--total">
                <i class="fa fa-globe"></i>
              </div>
              <div class="stat-card__info">
                <div class="stat-card__number">{{ stats.total }}</div>
                <div class="stat-card__label">Всего страниц</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--success">
                <i class="fa fa-check-circle"></i>
              </div>
              <div class="stat-card__info">
                <div class="stat-card__number">{{ stats.indexed }}</div>
                <div class="stat-card__label">Индексируется</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--warning">
                <i class="fa fa-exclamation-triangle"></i>
              </div>
              <div class="stat-card__info">
                <div class="stat-card__number">{{ stats.duplicates }}</div>
                <div class="stat-card__label">Дубли</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--error">
                <i class="fa fa-times-circle"></i>
              </div>
              <div class="stat-card__info">
                <div class="stat-card__number">{{ stats.errors + stats.warnings }}</div>
                <div class="stat-card__label">Проблемы</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Фильтры -->
        <section class="section">
          <div class="filters-card">
            <div class="filters-row">
              <div class="filter-group">
                <label>Поиск</label>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="input"
                  placeholder="Поиск по URL..."
                />
              </div>
              <div class="filter-group">
                <label>Статус</label>
                <select v-model="statusFilter" class="select">
                  <option value="all">Все страницы</option>
                  <option value="indexed">Индексируется</option>
                  <option value="duplicate">Дубли</option>
                  <option value="noindex">Не индексируется</option>
                  <option value="error">Ошибки</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <!-- Результат фильтрации -->
        <section class="section">
          <div class="section-header">
            <h2><i class="fa fa-list"></i> Локальные страницы ({{ currentOrigin || 'загрузка...' }})</h2>
            <span class="results-count">{{ filteredPages.length }} из {{ stats.total }}</span>
          </div>

          <!-- Загрузка -->
          <div v-if="isLoading" class="loading-state">
            <i class="fa fa-spinner fa-spin"></i>
            <span>Загрузка данных...</span>
          </div>

          <!-- Пустой результат -->
          <div v-else-if="filteredPages.length === 0" class="empty-state">
            <i class="fa fa-search"></i>
            <span>Страницы не найдены</span>
          </div>

          <!-- Список страниц -->
          <div v-else class="pages-list">
            <div 
              v-for="page in filteredPages" 
              :key="page.url" 
              class="page-card"
            >
              <!-- Заголовок страницы -->
              <div class="page-card__header">
                <div class="page-info">
                  <a :href="page.url" target="_blank" class="page-link">
                    <i class="fa fa-external-link"></i>
                    {{ page.url }}
                  </a>
                  <div v-if="page.metaTitle" class="page-title">{{ page.metaTitle }}</div>
                </div>
                <div class="page-status" :class="`page-status--${page.statusType}`">
                  <i 
                    class="fa" 
                    :class="{
                      'fa-check-circle': page.statusType === 'indexed',
                      'fa-exclamation-triangle': page.statusType === 'duplicate' || page.statusType === 'warning',
                      'fa-eye-slash': page.statusType === 'noindex',
                      'fa-times-circle': page.statusType === 'error'
                    }"
                  ></i>
                  {{ page.status }}
                </div>
              </div>

              <!-- Основная информация -->
              <div class="page-card__content">
                <!-- Только если есть проблемы -->
                <div v-if="page.issues && page.issues.length > 0" class="page-problems">
                  <div class="problems-header">
                    <i class="fa fa-exclamation-triangle"></i>
                    <span>{{ page.issues.length }} {{ page.issues.length === 1 ? 'проблема' : 'проблемы' }}</span>
                  </div>
                  <ul class="problems-list">
                    <li v-for="issue in page.issues.slice(0, 3)" :key="issue">
                      {{ issue }}
                    </li>
                    <li v-if="page.issues.length > 3" class="more-issues">
                      И еще {{ page.issues.length - 3 }} проблем...
                    </li>
                  </ul>
                </div>

                <!-- Краткая техническая информация -->
                <div class="page-tech" v-if="page.responseCode || page.robotsTag">
                  <span v-if="page.responseCode" class="tech-item" :class="{
                    'tech-item--success': page.responseCode === 200,
                    'tech-item--warning': page.responseCode >= 300 && page.responseCode < 400,
                    'tech-item--error': page.responseCode >= 400
                  }">
                    HTTP {{ page.responseCode }}
                  </span>
                  <span v-if="page.robotsTag && page.robotsTag !== 'index, follow'" class="tech-item">
                    {{ page.robotsTag }}
                  </span>
                  <span v-if="!page.hasH1" class="tech-item tech-item--warning">
                    Без H1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Рекомендации -->
        <section class="section">
          <!-- Все хорошо -->
          <div v-if="stats.duplicates === 0 && stats.errors === 0" class="recommendation-card recommendation-card--success">
            <div class="recommendation-header">
              <i class="fa fa-check-circle"></i>
              <h3>Все отлично!</h3>
            </div>
            <div class="recommendation-content">
              <p>Критических проблем не найдено. SEO настроено корректно.</p>
              <ul class="simple-list">
                <li>Страницы пагинации настроены правильно</li>
                <li>Canonical URL работают корректно</li>
                <li>Служебные страницы исключены из индексации</li>
              </ul>
            </div>
          </div>

          <!-- Есть проблемы -->
          <div v-else class="recommendation-card recommendation-card--warning">
            <div class="recommendation-header">
              <i class="fa fa-exclamation-triangle"></i>
              <h3>Требует внимания</h3>
            </div>
            <div class="recommendation-content">
              <div v-if="stats.duplicates > 0" class="problem-block">
                <h4>Дублированные страницы ({{ stats.duplicates }})</h4>
                <p>Проверьте настройки canonical URL и robots meta тегов для страниц пагинации.</p>
              </div>
              <div v-if="stats.errors > 0" class="problem-block">
                <h4>Ошибки страниц ({{ stats.errors }})</h4>
                <p>Исправьте недоступные страницы или настройте редиректы.</p>
              </div>
            </div>
          </div>

          <!-- Общие советы -->
          <div class="recommendation-card recommendation-card--info">
            <div class="recommendation-header">
              <i class="fa fa-lightbulb-o"></i>
              <h3>Полезные советы</h3>
            </div>
            <div class="recommendation-content">
              <div class="tips-grid">
                <div class="tip-column">
                  <h4>Что работает хорошо</h4>
                  <ul class="simple-list">
                    <li>{{ stats.indexed }} страниц индексируются</li>
                    <li>Основная SEO структура настроена</li>
                  </ul>
                </div>
                <div class="tip-column">
                  <h4>Следующие шаги</h4>
                  <ul class="simple-list">
                    <li>Проверить robots.txt</li>
                    <li>Добавить XML sitemap</li>
                    <li>Оптимизировать мета-описания</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Заголовок */
.seo-header {
  background: linear-gradient(215.61deg, #0cf -.3%, #006079 79.14%);
  color: #fff;
  padding: 2rem 0;
}

/* Красная кнопка */
.button--red {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

.button--red:hover {
  background: #c82333;
  border-color: #bd2130;
}

/* Информация о локальном анализе */
.local-info-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
  border: 2px solid #0cf;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.local-info-icon {
  width: 60px;
  height: 60px;
  background: #0cf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.local-info-content h3 {
  margin: 0 0 0.5rem 0;
  color: #006079;
  font-size: 1.25rem;
}

.local-info-content p {
  margin: 0 0 0.5rem 0;
  color: #495057;
}

.local-info-note {
  font-size: 0.9rem !important;
  color: #6c757d !important;
  font-style: italic;
}

.local-info-note i {
  margin-right: 0.5rem;
  color: #0cf;
}

.seo-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.seo-header__title h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.seo-header__title p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.seo-header__actions {
  display: flex;
  gap: 1rem;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card__icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fff;
}

.stat-card__icon--total { background: #6c757d; }
.stat-card__icon--success { background: #28a745; }
.stat-card__icon--warning { background: #ffc107; }
.stat-card__icon--error { background: #dc3545; }

.stat-card__number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #006079;
  line-height: 1;
}

.stat-card__label {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

/* Фильтры */
.filters-card {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filters-row {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 2rem;
  align-items: end;
}

.filter-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

/* Заголовок секции */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #006079;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-count {
  background: #f8f9fa;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #6c757d;
}

/* Состояния загрузки и пустого результата */
.loading-state,
.empty-state {
  background: #fff;
  border-radius: 0.5rem;
  padding: 3rem;
  text-align: center;
  color: #6c757d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-state i,
.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
}

/* Список страниц */
.pages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-card {
  background: #fff;
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.page-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-card__header {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.page-info {
  display: flex;
  flex-direction: column;
}

.page-link {
  color: #0cf;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-link:hover {
  color: #006079;
}

.page-title {
  color: #6c757d;
  font-size: 0.9rem;
}

.page-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.page-status--indexed {
  background: #d4edda;
  color: #155724;
}

.page-status--duplicate {
  background: #fff3cd;
  color: #856404;
}

.page-status--noindex {
  background: #d1ecf1;
  color: #0c5460;
}

.page-status--error {
  background: #f8d7da;
  color: #721c24;
}

.page-card__content {
  padding: 1.5rem;
}

.page-problems {
  margin-bottom: 1rem;
}

.problems-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc3545;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.problems-list {
  list-style: none;
  padding: 0;
}

.problems-list li {
  padding: 0.25rem 0;
  color: #dc3545;
  position: relative;
  padding-left: 1rem;
}

.problems-list li::before {
  content: "•";
  color: #dc3545;
  position: absolute;
  left: 0;
}

.page-tech {
  margin-top: 1rem;
}

.tech-item {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.tech-item--success {
  background: #d4edda;
  color: #155724;
}

.tech-item--warning {
  background: #fff3cd;
  color: #856404;
}

.tech-item--error {
  background: #f8d7da;
  color: #721c24;
}

/* Рекомендации */
.recommendation-card {
  background: #fff;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recommendation-card--success {
  border-left: 4px solid #28a745;
}

.recommendation-card--warning {
  border-left: 4px solid #ffc107;
}

.recommendation-card--info {
  border-left: 4px solid #17a2b8;
}

.recommendation-header {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.recommendation-header i {
  font-size: 1.25rem;
}

.recommendation-card--success .recommendation-header i {
  color: #28a745;
}

.recommendation-card--warning .recommendation-header i {
  color: #ffc107;
}

.recommendation-card--info .recommendation-header i {
  color: #17a2b8;
}

.recommendation-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #006079;
}

.recommendation-content {
  padding: 1.5rem;
}

.problem-block {
  margin-bottom: 1.5rem;
}

.problem-block h4 {
  color: #856404;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.problem-block p {
  color: #6c757d;
  line-height: 1.5;
}

.tips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.tip-column h4 {
  color: #0c5460;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.simple-list {
  list-style: none;
  padding: 0;
}

.simple-list li {
  padding: 0.25rem 0;
  color: #495057;
  position: relative;
  padding-left: 1rem;
}

.simple-list li::before {
  content: "•";
  color: #0cf;
  position: absolute;
  left: 0;
}

/* Адаптивность */
@media screen and (max-width: 768px) {
  .seo-header__content {
    flex-direction: column;
    text-align: center;
  }

  .seo-header__title h1 {
    font-size: 1.5rem;
  }

  .local-info-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .local-info-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .filters-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .page-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .page-tech {
    flex-direction: column;
    gap: 0.25rem;
  }

  .tips-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>