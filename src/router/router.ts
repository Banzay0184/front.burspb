import { createRouter, createWebHistory } from 'vue-router';
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
import ApiTest from '../pages/ApiTest.vue';
import SearchPage from '../pages/Search/SearchPage.vue';


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
    path: '/Basket/BasketPage',
    name: 'BasketPage',
    component: BasketPage,
    alias: '/basket'
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
    path: '/api-test',
    name: 'ApiTest',
    component: ApiTest,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;