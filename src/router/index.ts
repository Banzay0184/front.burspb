import { createRouter, createWebHistory } from 'vue-router';
import { updatePageTitle } from '../utils/seo';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('../pages/HomePage.vue'),
    meta: {
      title: 'Главная — Оборудование для бурения №1 в России',
      description: 'Профессиональное буровое оборудование - установки, долота, трубы, инструмент. Каталог, цены, доставка по России.',
      keywords: 'буровое оборудование, инструменты для бурения, буровые долота'
    }
  },
  {
    path: '/catalog',
    name: 'CatalogPage',
    component: () => import('../pages/Catalog/CatalogPage.vue'),
    meta: {
      title: 'Каталог',
      description: 'Каталог бурового оборудования - установки, долота, насосы, трубы. Широкий ассортимент качественного оборудования.'
    }
  },
  {
    path: '/basket',
    name: 'BasketPage',
    component: () => import('../pages/Basket/BasketPage.vue'),
    meta: {
      title: 'Корзина',
      description: 'Корзина товаров - оформление заказа на буровое оборудование. Расчет доставки и способы оплаты.'
    }
  },
  {
    path: '/dostavka',
    name: 'DostavkaPage',
    component: () => import('../pages/Dostavka/DostavkaPage.vue'),
    meta: {
      title: 'Доставка',
      description: 'Доставка бурового оборудования по России транспортными компаниями. Самовывоз из СПб.'
    }
  },
  {
    path: '/garantiya',
    name: 'GarantiyaPage',
    component: () => import('../pages/Garantiya/GarantiyaPage.vue'),
    meta: {
      title: 'Гарантия',
      description: 'Гарантийные обязательства ГК Буровые технологии. Условия обслуживания и сроки действия гарантии.'
    }
  },
  {
    path: '/kontakty',
    name: 'KontaktyPage',
    component: () => import('../pages/Kontakty/KontaktyPage.vue'),
    meta: {
      title: 'Контакты',
      description: 'Контакты ГК Буровые технологии - адреса офисов в СПб, телефоны отделов продаж и техподдержки.'
    }
  },
  {
    path: '/oplata',
    name: 'OplataPage',
    component: () => import('../pages/Oplata/OplataPage.vue'),
    meta: {
      title: 'Оплата',
      description: 'Способы оплаты заказов - наличный и безналичный расчет, банковские карты, рассрочка.'
    }
  },
  {
    path: '/okompanii',
    name: 'OkompaniiPage',
    component: () => import('../pages/Okompanii/OkompaniiPage.vue'),
    meta: {
      title: 'О компании',
      description: 'ГК Буровые технологии - надежный поставщик оборудования для бурения. Многолетний опыт работы.'
    }
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: () => import('../pages/Search/SearchPage.vue'),
    meta: {
      title: 'Поиск',
      description: 'Поиск по каталогу бурового оборудования. Найдите нужное оборудование по названию или артикулу.'
    }
  },
  {
    path: '/statji',
    name: 'StatjiPage',
    component: () => import('../pages/Statji/StatjiPage.vue'),
    meta: {
      title: 'Статьи',
      description: 'Статьи о буровом оборудовании и технологиях бурения. Экспертные материалы от специалистов.'
    }
  },
  {
    path: '/policy',
    name: 'PolicyPage',
    component: () => import('../pages/Policy/PolicyPage.vue'),
    meta: {
      title: 'Политика конфиденциальности',
      description: 'Политика конфиденциальности ГК Буровые технологии. Правила обработки персональных данных.'
    }
  },
  {
    path: '/terms',
    name: 'TermsPage',
    component: () => import('../pages/Terms/TermsPage.vue'),
    meta: {
      title: 'Условия использования',
      description: 'Пользовательское соглашение burspb.com. Условия использования интернет-магазина.'
    }
  },
  {
    path: '/cookie-policy',
    name: 'CookiePolicyPage',
    component: () => import('../pages/CookiePolicy/CookiePolicyPage.vue'),
    meta: {
      title: 'Политика использования cookie',
      description: 'Политика использования cookie файлов. Типы cookie и цели обработки данных.'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Обновляем заголовок при каждом переходе
router.beforeEach((to, _from, next) => {
  updatePageTitle(to);
  next();
});

// Дополнительное обновление после перехода выполняется через updatePageTitle

export default router; 