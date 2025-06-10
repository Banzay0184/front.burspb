import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App-ssg.vue'
import { routes } from './router/router'
import vuetify from './plugins/vuetify'
import './style.css'

// API Configuration
const API_BASE_URL = 'https://admin.burspb.com/data/v1'

// ViteSSG инициализация с правильной настройкой SSR
export const createApp = ViteSSG(
  App,
  { 
    routes,
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { top: 0 }
      }
    }
  },
  async (ctx) => {
    const { app, router, isClient, initialState } = ctx
    
    // Инициализация плагинов
const pinia = createPinia()
const head = createHead()

    app.use(pinia)
app.use(vuetify)
app.use(head)

    // Предварительная загрузка данных для SSG
    if (!isClient) {
      // Принудительно инициализируем initialState
      Object.assign(initialState, {
        popularProducts: [],
        articles: [],
        categories: [],
        popularBlocks: [],
        benefitsBlock: {},
        recentPostsBlock: [],
        globals: {},
        currentArticle: null
      });

      // Загружаем данные для главной страницы
      try {
        const response = await fetch(`${API_BASE_URL}/products/popular?limit=8`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.content)) {
            initialState.popularProducts = data.content;
          }
        }
          } catch (error) {
      // Тихо обрабатываем ошибку
    }

      // Выполнение дополнительных запросов параллельно
      const additionalRequests = [
        { url: 'posts', name: 'статьи', key: 'articles' },
        { url: 'categories', name: 'категории', key: 'categories' },
        { url: 'block/popular', name: 'блоки (Popular, Benefits, etc.)', key: 'blocks' },
      ];

      await Promise.allSettled(additionalRequests.map(async (request) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд таймаут
          
          const responses = await Promise.allSettled([
            fetch(`${API_BASE_URL}/${request.url}`, {
              signal: controller.signal
            }),
            fetch(`${API_BASE_URL}/block/benefits`),
            fetch(`${API_BASE_URL}/block/recent-posts`),
            fetch(`${API_BASE_URL}/globals`),
          ]);
          
          clearTimeout(timeoutId);
          
          // Обрабатываем основной запрос
          const mainResponse = responses[0];
          let finalData = [];
          if (mainResponse.status === 'fulfilled' && mainResponse.value.ok) {
            const data = await mainResponse.value.json();
            if (data.success) {
              if (request.key === 'blocks') {
                finalData = data.content || [];
                // Добавляем данные в соответствующие ключи
                if (Array.isArray(finalData) && finalData.length > 0) {
                  initialState.popularBlocks = finalData;
                }
              } else {
                finalData = data.content || [];
                if (request.key === 'articles') {
                  initialState.articles = finalData;
                } else if (request.key === 'categories') {
                  initialState.categories = finalData;
                }
              }
            }
          } else if (mainResponse.status === 'fulfilled') {
            // Тихо обрабатываем ошибку API
          }

          // Обрабатываем блок Benefits
          const benefitsResponse = responses[1];
          if (benefitsResponse.status === 'fulfilled' && benefitsResponse.value.ok) {
            const benefitsData = await benefitsResponse.value.json();
            if (benefitsData.success && Array.isArray(benefitsData.content)) {
              initialState.benefitsBlock = benefitsData.content;
            }
          }

          // Обрабатываем блок Recent Posts  
          const recentPostsResponse = responses[2];
          if (recentPostsResponse.status === 'fulfilled' && recentPostsResponse.value.ok) {
            const recentPostsData = await recentPostsResponse.value.json();
            // Обрабатываем данные в различных форматах (success НЕ обязательно)
            if (recentPostsData.content?.posts && Array.isArray(recentPostsData.content.posts)) {
              initialState.recentPostsBlock = recentPostsData.content.posts;
            } else if (Array.isArray(recentPostsData.content)) {
              initialState.recentPostsBlock = recentPostsData.content;
            } else if (Array.isArray(recentPostsData.data)) {
              initialState.recentPostsBlock = recentPostsData.data;
            }
                      }

          // Обрабатываем Globals данные
          const globalsResponse = responses[3];
          if (globalsResponse.status === 'fulfilled' && globalsResponse.value.ok) {
            const globalsData = await globalsResponse.value.json();
            if (globalsData.success && globalsData.content) {
              initialState.globals = globalsData.content;
            }
          }

        } catch (error) {
          // Тихо обрабатываем ошибку загрузки
        }
      }));

      // Передаем initialState в context для SSG 
      (ctx as any).initialState = initialState;
      
      // ДОПОЛНИТЕЛЬНО: сохraняем данные в глобальный объект для SSG
      if (typeof globalThis !== 'undefined') {
        (globalThis as any).__SSG_INITIAL_STATE__ = initialState;
      }
      
      // Загружаем данные для детальных страниц статей если это детальная страница
      // В SSG контексте получаем путь из роутера, а не из window
      const currentPath = ctx.router ? ctx.router.currentRoute.value.path : '';
      if (currentPath.startsWith('/statji/') && currentPath !== '/statji') {
        const slug = currentPath.replace('/statji/', '');
        try {
          const articleResponse = await fetch(`${API_BASE_URL}/post/slug/${slug}`);
          if (articleResponse.ok) {
            const articleData = await articleResponse.json();
            if (articleData.success && articleData.content) {
              // Сохраняем данные статьи в initialState
              initialState.currentArticle = articleData.content;
              // Обновляем глобальный объект
              if (typeof globalThis !== 'undefined') {
                (globalThis as any).__SSG_INITIAL_STATE__.currentArticle = articleData.content;
              }
            }
          }
        } catch (error) {
          // Тихо обрабатываем ошибку загрузки статьи
        }
      }

      // SSR: устанавливаем мета-теги перед рендерингом
      router.beforeEach((to) => {
        const routeMeta = to.meta || {}
        
        if (routeMeta.title) {
          head.addHeadObjs({ 
            title: routeMeta.title as string 
          })
        }
        
        if (routeMeta.description) {
          head.addHeadObjs({
            meta: [{ 
              name: 'description', 
              content: routeMeta.description as string 
            }]
          })
        }
        
        // Устанавливаем canonical URL
        const canonicalUrl = to.path === '/' ? 'https://burspb.com/' : `https://burspb.com${to.path}`;
        head.addHeadObjs({
          link: [{ 
            rel: 'canonical', 
            href: canonicalUrl 
          }]
        })
      })
    } else {
      // Клиентская сторона - логика SPA навигации
      router.beforeResolve((to) => {
        const routeMeta = to.meta || {}
        
        // Устанавливаем базовые мета-теги из router meta
        if (routeMeta.title) {
          head.addHeadObjs({ title: routeMeta.title as string })
          // DOM обновление title происходит через updatePageTitle в роутере
        }
        
        if (routeMeta.description) {
          head.addHeadObjs({
            meta: [{ name: 'description', content: routeMeta.description as string }]
          })
          
          // Обновляем через DOM
          if (typeof document !== 'undefined') {
            let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
            if (metaDesc) {
              metaDesc.setAttribute('content', routeMeta.description as string);
            }
          }
        }
        
        // Обновляем canonical
        if (typeof document !== 'undefined') {
          const canonicalUrl = to.path === '/' ? 'https://burspb.com/' : `https://burspb.com${to.path}`;
          let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
          if (canonicalLink) {
            canonicalLink.setAttribute('href', canonicalUrl);
          }
        }
      })
    }
  }
)
/*
function updateSeoForRoute(path: string) {
  if (typeof window === 'undefined') return
  
  try {
    // 1. Обновляем canonical URL
    const baseUrl = window.location.origin.includes('localhost') 
      ? window.location.origin 
      : 'https://burspb.com'
    
    let canonicalUrl = `${baseUrl}${path}`
    
    // Для главной страницы убираем слэш в конце только для продакшн
    if (path === '/' && !baseUrl.includes('localhost')) {
      canonicalUrl = 'https://burspb.com'
    }
    
    // Для страниц пагинации canonical указывает на первую страницу
    if (path.includes('/page/')) {
      const basePath = path.replace(/\/page\/\d+$/, '')
      canonicalUrl = `${baseUrl}${basePath}`
    }
    
    // Обновляем canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonicalUrl
    
    // 2. Обновляем title и description
    const title = getPageTitle()
    const description = getPageDescription(path)
    
    // Обновляем title
    document.title = title
    
    // Обновляем description
    const descriptionMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement
    if (descriptionMeta) {
      descriptionMeta.content = description
    }
  } catch (error) {
    // Тихо обрабатываем ошибку SEO
  }
}
*/