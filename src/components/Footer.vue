<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../api/api';
import ModalWindow from './ModalWindow.vue';

const isModalVisible = ref(false);
const logoFooter = ref('/image/2d0daf.svg');
const phone = ref('8 812 242 75 85');
const phoneAlt = ref('8 812 242 75 88');
const email = ref('info@burspb.com');
const address = ref('Санкт-Петербург, Южное Шоссе, 37 к.4 лит. Б');
const entity = ref('ООО Группа компаний "Буровые технологии"\nИНН 7816318009\nОГРН 1167847080565');
const workingDays = ref('Понедельник - Пятница');
const workingHours = ref('10:00 - 18:00');
const socialLinks = ref([
  {
    title: 'info@burspb.com',
    url: 'info@burspb.com',
    icon: 'fa fa-envelope'
  },
  {
    title: 'Telegram',
    url: 'https://t.me/bur_spb',
    icon: 'fa fa-telegram'
  },
  {
    title: 'Whatsapp',
    url: 'https://api.whatsapp.com/send?phone=79213162621',
    icon: 'fa fa-whatsapp'
  }
]);

interface CategoryItem {
  nav_id: number;
  title: string;
  slug: string;
  type: 'taxonomy' | 'post_type';
}

interface NavItem {
  nav_id: number;
  title: string;
  slug: string;
}

const categoriesFooter = ref<CategoryItem[]>([]);
const mainNavFooter = ref<NavItem[]>([]);

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    
    if (response.data) {
      if (response.data.logo && response.data.logo.footer) {
        logoFooter.value = response.data.logo.footer;
      }
      
      if (response.data.contact) {
        const contact = response.data.contact;
        phone.value = contact.phone || phone.value;
        phoneAlt.value = contact.phone_alt || phoneAlt.value;
        email.value = contact.email || email.value;
        address.value = contact.address || address.value;
        entity.value = contact.entity || entity.value;
        workingDays.value = contact.working_days || workingDays.value;
        workingHours.value = contact.working_hours || workingHours.value;
      }
      
      
      
      if (response.data.navigation && response.data.navigation.categories) {
        categoriesFooter.value = response.data.navigation.categories;
      }
      
      if (response.data.navigation && response.data.navigation.main) {
        mainNavFooter.value = response.data.navigation.main;
      }
    }
  } catch (error) {
    console.error('Ошибка при загрузке глобальных данных:', error);
  }
};

onMounted(() => {
  fetchGlobalData();
});

const getCategoryPath = (category: CategoryItem) => {
  if (category.type === 'taxonomy') {
    return `/catalog/selection-${category.slug}`;
  } else if (category.type === 'post_type') {
    return `/catalog/${category.slug}`;
  }
  return `/catalog/selection-${category.slug}`;
};

const getPagePath = (item: NavItem) => {
  const pageMap: Record<string, string> = {
    'garantiya': '/garantiya',
    'oplata': '/oplata',
    'dostavka': '/dostavka',
    'o-kompanii': '/o-kompanii',
    'kontakty': '/kontakty'
  };
  
  return pageMap[item.slug] || `/${item.slug}`;
};
</script>

<template>

  <footer class="footer">
    <div class="wrapper">
      <div itemtype="http://schema.org/Organization" class="invisible">
        <div itemprop="name">{{ entity.split('\n')[0] }}</div>
        <link itemprop="url" href="https://burspb.com/">

        <div itemprop="address"  itemtype="https://schema.org/PostalAddress">
          <span itemprop="postalCode">192241</span>
          <span itemprop="addressCountry">Россия</span>
          <span itemprop="addressRegion">Санкт-Петербург</span>
          <span itemprop="addressLocality">Санкт-Петербург</span>
          <span itemprop="streetAddress">{{ address }}</span>
        </div>

        <div>
          <a itemprop="telephone" :href="`tel:+${phone.replace(/\s/g, '')}`">{{ phone }}</a>
          <a itemprop="telephone" :href="`tel:+${phoneAlt.replace(/\s/g, '')}`">{{ phoneAlt }}</a>
          <a itemprop="email" :href="`mailto:${email}`">{{ email }}</a>
        </div>
      </div>
      
      <div class="row">
        <div class="column column--info">
          <div class="logo">
            <RouterLink 
              to="/" 
              aria-current="page" 
              aria-label="Главная страница"
              class="nuxt-link-exact-active nuxt-link-active"
            >
              <img :src="logoFooter" width="170" height="56" alt="Оборудование для бурения №1 в России" loading="lazy">
            </RouterLink>
          </div>
          
          <div class="phones phones--footer">
            <a :href="`tel:+${phone.replace(/\s/g, '')}`" class="phones__item">
              <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
              <div>
                <span class="phones__item__number">{{ phone }}</span>
                <span class="phones__item__office">Офис-склад СПБ-Юг</span>
              </div>
            </a>
            <a :href="`tel:+${phoneAlt.replace(/\s/g, '')}`" class="phones__item">
              <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
              <div>
                <span class="phones__item__number">{{ phoneAlt }}</span>
                <span class="phones__item__office">Офис-склад СПБ-Север</span>
              </div>
            </a>
            <div class="phones__action">
              <span class="button-wrapper">
                <button 
                  @click="openModal" 
                  class="button button--blue button button--unstyled"
                  aria-label="Заказать обратный звонок"
                >
                  Заказать звонок
                </button>
              </span>
            </div>
            <ModalWindow :is-visible="isModalVisible"  @close="closeModal"></ModalWindow>
          </div>
          
          <div class="social social--footer">
            <ul>
              <li v-for="(link, index) in socialLinks" :key="index" class="social__item">
                <a 
                  :href="link.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span class="social__item__icon"><i :class="link.icon"></i></span>
                  <span class="social__item__title">{{ link.title }}</span>
                  <span class="accessibility">Вы можете связаться с нами посредством {{ link.title }}</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div class="working-hours">
            <div class="working-hours__title">
              <i class="fa fa-clock-o"></i>
              <span>Время работы:</span>
            </div>
            <div class="working-hours__content">
              <p>{{ workingDays }}</p>
              <p>{{ workingHours }}</p>
            </div>
          </div>
          
          <div class="show-mobile-only">
            <div class="address">
              <div class="address__title">
                <i class="fa fa-map-marker"></i>
                <span>Адрес:</span>
              </div>
              <div class="address__content">{{ address }}</div>
            </div>
            
            <div class="entity">
              {{ entity }}
            </div>
            
            <div class="dev-by">
              <div>
                <div class="dev-by__prime">
                  <a href="https://kls-digital.ru/?utm_source=reference&amp;utm_medium=burspb&amp;utm_campaign=text" target="_blank" class="span">Разработка сайта и СЕО продвижение</a>
                  <a href="https://kls-digital.ru/?utm_source=reference&amp;utm_medium=burspb&amp;utm_campaign=text" target="_blank">KLS Digital</a>
                </div>
                <div class="dev-by__coder">
                  <a href="https://atypicalcoder.dev/?utm_source=reference&amp;utm_medium=burspb&amp;utm_campaign=text" target="_blank" class="span">Программирование и поддержка</a>
                  <a href="https://atypicalcoder.dev/?utm_source=reference&amp;utm_medium=burspb&amp;utm_campaign=text" target="_blank">Atypicalcoder.Dev</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="column column--navs">
          <nav class="navigation navigation--footer">
            <ul itemtype="http://schema.org/SiteNavigationElement">
              <li class="navigation__item navigation__item--home">
                <RouterLink to="/" aria-current="page" itemprop="url" class="nuxt-link-exact-active nuxt-link-active">
                    <span class="navigation__item__title">Главная</span>
                </RouterLink>
              </li>
              <li class="navigation__item">
                <RouterLink to="/statji" itemprop="url">
                    <span class="navigation__item__title">Статьи</span>
                </RouterLink>
              </li>
              <li 
                v-for="item in mainNavFooter" 
                :key="item.nav_id" 
                class="navigation__item"
              >
                <RouterLink :to="getPagePath(item)" itemprop="url">
                  <span class="navigation__item__title">{{ item.title }}</span>
                </RouterLink>
              </li>
            </ul>
          </nav>
          
          <nav class="categories categories--footer">
            <ul itemtype="http://schema.org/SiteNavigationElement">
              <li class="categories__item">
                  <RouterLink to="/catalog" itemprop="url">
                      <span class="categories__item__title">Каталог</span>
                  </RouterLink>
              </li>
              <li 
                v-for="category in categoriesFooter" 
                :key="category.nav_id" 
                class="categories__item"
              >
                  <RouterLink :to="getCategoryPath(category)" itemprop="url">
                      <span class="categories__item__title">{{ category.title }}</span>
                  </RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="row show-desktop-only">
        <div class="column column--left">
          <div class="address">
            <div class="address__title">
              <i class="fa fa-map-marker"></i>
              <span>Адрес:</span>
            </div>
            <div class="address__content">{{ address }}</div>
          </div>
        </div>
        
        <div class="column column--right">
          <div class="entity">
            {{ entity }}
          </div>
          
          <div class="dev-by">
            <div>
              <div class="dev-by__coder">
                <a href="https://atypicalcoder.dev/?utm_source=reference&amp;utm_medium=burspb&amp;utm_campaign=text" target="_blank" class="span">Программирование и поддержка</a>
                <a href="https://atypicalcoder.dev/?utm_source=reference&amp;utm_medium=burspb&amp;utm_campaign=text" target="_blank"> Atypicalcoder.Dev</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer__policies">
                <RouterLink to="/policy" class="footer__policy-link">Политика конфиденциальности</RouterLink>
                <RouterLink to="/terms" class="footer__policy-link">Согласие на обработку персональных данных</RouterLink>
                <RouterLink to="/cookie-policy" class="footer__policy-link">Политика обработки файлов Cookie</RouterLink>
              </div>

    </div>
  </footer>
  
</template>

<style>

.footer__policies {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.footer__policy-link  {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #0cf;
  text-decoration: underline;
}

.footer__policy-link:hover {
  color: #000;
  text-decoration: none;
}


@media (max-width: 768px) {
  .footer__policies {
    flex-direction: column;
  }
}
</style>