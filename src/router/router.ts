import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import CatalogPage from '../pages/Catalog/CatalogPage.vue';
import StatjiPage from '../pages/Statji/StatjiPage.vue';
import StatjiDetail from '../pages/Statji/StatjiDetail.vue';
import GarantiyaPage from '../pages/Garantiya/GarantiyaPage.vue';
import OplataPage from '../pages/Oplata/OplataPage.vue';
import DostavkaPage from '../pages/Dostavka/DostavkaPage.vue';
import OkompaniiPage from '../pages/Okompanii/OkompaniiPage.vue';
import KontaktyPage from '../pages/Kontakty/KontaktyPage.vue';
import CategoryBurovyeDolota from '../pages/Catalog/CategoryBurovyeDolota.vue';
import CatalogDetail from '../pages/Catalog/CatalogDetail.vue';
import BasketPage from '../pages/Basket/BasketPage.vue';
import ConfirmPage from '../pages/Basket/Confirm/ConfirmPage.vue';
import SearchPage from '../pages/Search/SearchPage.vue';
import PolicyPage from '../pages/Policy/PolicyPage.vue';
import TermsPage from '../pages/Terms/TermsPage.vue';
import CookiePolicyPage from '../pages/CookiePolicy/CookiePolicyPage.vue';
import SeoDashboard from '../pages/SeoDashboard/SeoDashboard.vue';
import SeoReport from '../pages/SeoDashboard/SeoReport.vue';
// SEO управляется через SeoManager компонент


const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/catalog',
    name: 'CatalogPage',
    component: CatalogPage,
  },
  {
    path: '/statji',
    name: 'StatjiPage',
    component: StatjiPage,
  },
  {
    path: '/statji/category/:category',
    name: 'StatjiCategory',
    component: StatjiPage,
  },
  {
    path: '/garantiya',
    name: 'GarantiyaPage',
    component: GarantiyaPage,
  },
  {
    path: '/oplata',
    name: 'OplataPage',
    component: OplataPage,
  },
  {
    path: '/dostavka',
    name: 'DostavkaPage',
    component: DostavkaPage,
  },
  {
    path: '/o-kompanii',
    name: 'OkompaniiPage',
    component: OkompaniiPage,
  },
  {
    path: '/kontakty',
    name: 'KontaktyPage',
    component: KontaktyPage,
  },
  {
    path: '/basket',
    name: 'BasketPage',
    component: BasketPage,
    alias: '/basket',
  },
  {
    path: '/basket/confirm',
    name: 'ConfirmPage',
    component: ConfirmPage,
  },
  {
    path: '/statji/:slug',
    name: 'StatjiDetailWithSlug',
    component: StatjiDetail,
  },
  {
    path: '/seo-dashboard',
    name: 'SeoDashboard',
    component: SeoDashboard,
  },
  {
    path: '/seo-report',
    name: 'SeoReport',
    component: SeoReport,
  },
  {
    path: '/catalog/category-:slug',
    name: 'CategoryDetail',
    component: CategoryBurovyeDolota,
  },
  {
    path: '/catalog/category-:slug/page/:page',
    name: 'CategoryDetailPagination',
    component: CategoryBurovyeDolota,
  },
  {
    path: '/catalog/selection-:slug',
    name: 'SelectionDetail',
    component: CategoryBurovyeDolota,
  },
  {
    path: '/catalog/selection-:slug/page/:page',
    name: 'SelectionDetailPagination',
    component: CategoryBurovyeDolota,
  },
  {
    path: '/catalog/product-:slug',
    name: 'ProductDetail',
    component: CatalogDetail,
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: SearchPage,
  },
  {
    path: '/policy',
    name: 'PolicyPage',
    component: PolicyPage,
  },
  {
    path: '/terms',
    name: 'TermsPage',
    component: TermsPage,
  },
  {
    path: '/cookie-policy',
    name: 'CookiePolicyPage',
    component: CookiePolicyPage,  
  },
];

// Экспортируем routes для vite-ssg
export { routes };

const router = createRouter({
  history: typeof window !== 'undefined' ? createWebHistory() : createMemoryHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Немедленное обновление canonical URL при изменении роута
// КРИТИЧЕСКИ ВАЖНО для SEO роботов
router.afterEach((to) => {
  
  // Немедленно обновляем canonical URL с учетом окружения
  setTimeout(() => {
    // Определяем BASE_URL динамически для текущего окружения
    const baseUrl = typeof window !== 'undefined' 
      ? (window.location.origin.includes('localhost') ? window.location.origin : 'https://burspb.com')
      : 'https://burspb.com';
    
    let canonicalUrl = `${baseUrl}${to.path}`;
    
    // Для главной страницы убираем слэш в конце только для продакшн
    if (to.path === '/' && !baseUrl.includes('localhost')) {
      canonicalUrl = 'https://burspb.com';
    }
    
    // Для страниц пагинации canonical указывает на первую страницу
    if (to.path.includes('/page/')) {
      const basePath = to.path.replace(/\/page\/\d+$/, '');
      canonicalUrl = `${baseUrl}${basePath}`;
    }
    
      // Обновляем canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  
  canonicalLink.href = canonicalUrl;
  }, 50); // Минимальная задержка для DOM обновления
});

export default router;