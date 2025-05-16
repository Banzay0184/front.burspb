import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import CatalogPage from '../pages/Catalog/CatalogPage.vue';
import StatjiPage from '../pages/Statji/StatjiPage.vue';
import GarantiyaPage from '../pages/Garantiya/GarantiyaPage.vue';
import OplataPage from '../pages/Oplata/OplataPage.vue';
import DostavkaPage from '../pages/Dostavka/DostavkaPage.vue';
import OkompaniiPage from '../pages/Okompanii/OkompaniiPage.vue';
import KontaktyPage from '../pages/Kontakty/KontaktyPage.vue';
import CategoryBurovyeDolota from '../pages/Catalog/CategoryBurovyeDolota.vue';
import CatalogDetail from '../pages/Catalog/CatalogDetail.vue';


const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/Catalog/CatalogPage',
    name: 'CatalogPage',
    component: CatalogPage,
  },
  {
    path: '/Statji/StatjiPage',
    name: 'StatjiPage',
    component: StatjiPage,
  },
  {
    path: '/Garantiya/GarantiyaPage',
    name: 'GarantiyaPage',
    component: GarantiyaPage,
  },
  {
    path: '/Oplata/OplataPage',
    name: 'OplataPage',
    component: OplataPage,
  },
  {
    path: '/Dostavka/DostavkaPage',
    name: 'DostavkaPage',
    component: DostavkaPage,
  },
  {
    path: '/Okompanii/OkompaniiPage',
    name: 'OkompaniiPage',
    component: OkompaniiPage,
  },
  {
    path: '/Kontakty/KontaktyPage',
    name: 'KontaktyPage',
    component: KontaktyPage,
  },

  // FOR TEST
  {
    path: '/Catalog/CategoryBurovyeDolota',
    name: 'CategoryBurovyeDolota',
    component: CategoryBurovyeDolota,
  },
  {
    path: '/Catalog/CatalogDetail',
    name: 'CatalogDetail',
    component: CatalogDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;