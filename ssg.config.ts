// Функция для получения мета-данных из роутера
function getRouteMeta(route: string, routes: any[]) {
  const routeConfig = routes.find((r: any) => r.path === route);
  return routeConfig?.meta || {};
}

// Функция загрузки статей для генерации роутов
async function loadArticlesForSSG() {
  try {
    const response = await fetch('https://admin.burspb.com/data/v1/posts');
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.content)) {
        return data.content;
      }
    }
  } catch (error) {
    console.log('Не удалось загрузить статьи для SSG:', error);
  }
  return [];
}

export default {
  ssg: {
    // Добавляем конкретные роуты статей для тестирования
    includeRoutes: [
      '/statji/kak-vybrat-skvazhinnyj-nasos',
      '/statji/texnologiya-bureniya',
      '/statji/vidy-burovyx-ustanovok'
    ],
    async onBeforePageRender(route, indexHTML, appCtx) {
      console.log('SSG CONFIG: Обрабатываем роут:', route);
      
      // Дефолтный суффикс для всех страниц
      const DEFAULT_SUFFIX = 'Оборудование для бурения №1 в России';
      const GK_SUFFIX = 'ГК Буровые технологии — Оборудование для бурения №1 в России';
      
      const routes = [
        { path: '/', meta: { title: `Главная — ${DEFAULT_SUFFIX}`, description: 'Поставка оборудования и инструмента для бурения скважин' } },
        { path: '/catalog', meta: { title: `Каталог — ${DEFAULT_SUFFIX}`, description: 'Каталог бурового оборудования и инструментов. Широкий ассортимент качественной продукции для бурения скважин.' } },
        { path: '/basket', meta: { title: `Корзина — ${DEFAULT_SUFFIX}`, description: 'Корзина покупок. Оформление заказа бурового оборудования с доставкой по России.' } },
        { path: '/basket/confirm', meta: { title: `Подтверждение заказа — ${DEFAULT_SUFFIX}`, description: 'Подтверждение и оформление заказа бурового оборудования.' } },
        { path: '/statji', meta: { title: `Статьи — ${DEFAULT_SUFFIX}`, description: 'Полезные статьи и материалы об оборудовании для бурения скважин. Профессиональные советы и рекомендации.' } },
        { path: '/o-kompanii', meta: { title: `О компании — ${GK_SUFFIX}`, description: 'Группа компаний «Буровые технологии»: надежный поставщик оборудования и инструмента для бурения скважин. 🔥Широкий выбор товара! ✅Гарантия производителя!🚚 Доставка! 🎁Всегда в наличии!' } },
        { path: '/kontakty', meta: { title: `Контакты — ${GK_SUFFIX}`, description: 'Контактная информация и телефон компании ГК Буровые технологии.' } },
        { path: '/dostavka', meta: { title: `Доставка — ${GK_SUFFIX}`, description: 'Удобные способы доставки вашего товара. ГК Буровые технологии это 🔥Широкий выбор товара! ✅Гарантия производителя!🚚 Доставка! 🎁Всегда в наличии!' } },
        { path: '/oplata', meta: { title: `Оплата — ${DEFAULT_SUFFIX}`, description: 'Способы оплаты бурового оборудования. Удобные варианты расчета для юридических и физических лиц.' } },
        { path: '/garantiya', meta: { title: `Гарантия — ${GK_SUFFIX}`, description: 'Гарантийные обязательства компании ГК Буровые технологии одно из приоритетных направлений в обслуживании клиентов. Оставьте заявку о наступлении гарантийного случая менее чем за 1 минуту!' } },
        { path: '/search', meta: { title: `Поиск — ${DEFAULT_SUFFIX}`, description: 'Поиск по каталогу бурового оборудования. Быстрый поиск нужных инструментов и материалов.' } },
        { path: '/policy', meta: { title: `Политика конфиденциальности — ${GK_SUFFIX}`, description: 'Политика конфиденциальности и обработки персональных данных компании ГК Буровые технологии.' } },
        { path: '/terms', meta: { title: `Условия использования — ${GK_SUFFIX}`, description: 'Пользовательское соглашение и условия использования сайта ГК Буровые технологии.' } },
        { path: '/cookie-policy', meta: { title: `Политика использования Cookie — ${GK_SUFFIX}`, description: 'Политика использования файлов Cookie на сайте ГК Буровые технологии.' } },
        { path: '/seo-dashboard', meta: { title: 'SEO Панель — Burspb Admin', description: 'Административная панель для управления SEO настройками сайта.' } },
        { path: '/seo-report', meta: { title: 'SEO Отчет — Burspb Admin', description: 'Детальный SEO отчет по состоянию сайта и рекомендации по улучшению.' } }
      ];

      // Получаем мета-данные для текущего роута
      let routeMeta = getRouteMeta(route, routes);
      
      // Специальная обработка для детальных страниц статей
      if (route.startsWith('/statji/') && route !== '/statji') {
        const slug = route.replace('/statji/', '');
        
        // Попытаемся получить данные статьи из предзагруженных данных
        const initialState = (appCtx as any).initialState || 
                             (typeof globalThis !== 'undefined' ? (globalThis as any).__SSG_INITIAL_STATE__ : null);
        
        // Сначала проверяем currentArticle (для конкретной загруженной статьи)
        if (initialState?.currentArticle && initialState.currentArticle.title) {
          const article = initialState.currentArticle;
          // Создаем описание из первых 150 символов контента без HTML
          const cleanContent = article.content ? article.content.replace(/<[^>]*>/g, '') : '';
          const description = cleanContent.length > 150 
            ? `${cleanContent.slice(0, 150)}...` 
            : (cleanContent || `Статья: ${article.title}. Полезная информация об оборудовании для бурения скважин.`);
            
          routeMeta = {
            title: `${article.title} — ${DEFAULT_SUFFIX}`,
            description: description
          };
        }
        // Затем проверяем список статей
        else if (initialState?.articles && Array.isArray(initialState.articles)) {
          const article = initialState.articles.find((a: any) => a.slug === slug);
          if (article && article.title) {
            routeMeta = {
              title: `${article.title} — ${DEFAULT_SUFFIX}`,
              description: article.excerpt || article.description || `Статья: ${article.title}. Полезная информация об оборудовании для бурения скважин.`
            };
          }
        }
        
        // Если не нашли в предзагруженных данных, загружаем статью напрямую
        if (!routeMeta.title) {
          try {
            const articleResponse = await fetch(`https://admin.burspb.com/data/v1/post/slug/${slug}`);
            if (articleResponse.ok) {
              const articleData = await articleResponse.json();
              if (articleData.success && articleData.content && articleData.content.title) {
                const article = articleData.content;
                const cleanContent = article.content ? article.content.replace(/<[^>]*>/g, '') : '';
                const description = cleanContent.length > 150 
                  ? `${cleanContent.slice(0, 150)}...` 
                  : `Статья: ${article.title}. Полезная информация об оборудовании для бурения скважин.`;
                  
                routeMeta = {
                  title: `${article.title} — ${DEFAULT_SUFFIX}`,
                  description: description
                };
              }
            }
          } catch (error) {
            // Если API не доступен, используем fallback
          }
        }
        
        // Финальный fallback - генерируем заголовок из slug
        if (!routeMeta.title) {
          const titleFromSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          routeMeta = {
            title: `${titleFromSlug} — ${DEFAULT_SUFFIX}`,
            description: `Статья: ${titleFromSlug}. Полезная информация об оборудовании для бурения скважин.`
          };
        }
      }

      // Используем данные из context или глобального объекта (загруженные в main.ts)
      const initialState = (appCtx as any).initialState || 
                           (typeof globalThis !== 'undefined' ? (globalThis as any).__SSG_INITIAL_STATE__ : null) || {
        popularProducts: [],
        articles: [],
        categories: [],
        popularBlocks: [],
        benefitsBlock: {},
        recentPostsBlock: [],
        globals: {}
      };
      
      

      // Заменяем плейсхолдеры в HTML
      let updatedHTML = indexHTML;
      
      // Заменяем мета-теги
      if (routeMeta.title) {
        updatedHTML = updatedHTML.replace(
          /<title>.*?<\/title>/,
          `<title>${routeMeta.title}</title>`
        );
      }
      
      if (routeMeta.description) {
        updatedHTML = updatedHTML.replace(
          /<meta name="description" content=".*?">/,
          `<meta name="description" content="${routeMeta.description}">`
        );
      }
      
      // Заменяем canonical URL
      const canonicalUrl = route === '/' ? 'https://burspb.com/' : `https://burspb.com${route}`;
      updatedHTML = updatedHTML.replace(
        /<link rel="canonical" href=".*?">/,
        `<link rel="canonical" href="${canonicalUrl}">`
      );
      
      // Внедряем данные SSG - ищем строку с JSON данными  
      const initialStateJSON = JSON.stringify(initialState);
      // Ищем строку вида: window.__INITIAL_STATE__="{...}"
      updatedHTML = updatedHTML.replace(
        /window\.__INITIAL_STATE__\s*=\s*"[^"]*"/g,
        `window.__INITIAL_STATE__=${initialStateJSON}`
      );

      return updatedHTML;
    }
  }
};