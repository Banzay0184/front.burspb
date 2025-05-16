<script setup lang="ts">
import { ref } from 'vue';
import ModalWindow from './ModalWindow.vue';

const isModalVisible = ref(false);

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};
</script>

<template>

  <footer class="footer">
    <div class="wrapper">
      <div itemtype="http://schema.org/Organization" class="invisible">
        <div itemprop="name">ООО Группа компаний "Буровые технологии"</div>
        <link itemprop="url" href="https://burspb.com/">

        <div itemprop="address"  itemtype="https://schema.org/PostalAddress">
          <span itemprop="postalCode">192241</span>
          <span itemprop="addressCountry">Россия</span>
          <span itemprop="addressRegion">Санкт-Петербург</span>
          <span itemprop="addressLocality">Санкт-Петербург</span>
          <span itemprop="streetAddress">Южное шоссе 37, корпус 4</span>
        </div>

        <div>
          <a itemprop="telephone" href="tel:+78009006050">8 800 900 60 50</a>
          <a itemprop="telephone" href="tel:+78009006050">8 800 900 60 50</a>
          <a itemprop="email" href="mailto:info@burspb.com">info@burspb.com</a>
        </div>
      </div>
      
      <div class="row">
        <div class="column column--info">
          <div class="logo">
            <RouterLink to="/"aria-current="page" class="nuxt-link-exact-active nuxt-link-active">
              <img src="/image/2d0daf.svg" width="170" height="56" alt="Оборудование для бурения №1 в России" loading="lazy">
            </RouterLink>
          </div>
          
          <div class="phones phones--footer">
            <a href="tel:+78122427585" class="phones__item">
              <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
              <div>
                <span class="phones__item__number">8 812 242 75 85</span>
                <span class="phones__item__office">Офис-склад СПБ-Юг</span>
              </div>
            </a>
            <a href="tel:+78122427588" class="phones__item">
              <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
              <div>
                <span class="phones__item__number">8 812 242 75 88</span>
                <span class="phones__item__office">Офис-склад СПБ-Север</span>
              </div>
            </a>
            <div class="phones__action">
              <span class="button-wrapper">
                <button @click="openModal" class="button button--blue button button--unstyled">Заказать звонок</button>
              </span>
            </div>
            <ModalWindow :is-visible="isModalVisible"  @close="closeModal"></ModalWindow>
          </div>
          
          <div class="social social--footer">
            <ul>
              <li class="social__item">
                <a href="mailto:info@burspb.com" target="_blank">
                  <span class="social__item__icon"><i class="fa fa-envelope"></i></span>
                  <span class="social__item__title">info@burspb.com</span>
                  <span class="accessibility">Вы можете связаться с нами посредством Email</span>
                </a>
              </li>
              <li class="social__item">
                <a href="https://t.me/bur_spb" target="_blank">
                  <span class="social__item__icon"><i class="fa fa-telegram"></i></span>
                  <span class="social__item__title">Telegram</span>
                  <span class="accessibility">Вы можете связаться с нами посредством Telegram</span>
                </a>
              </li>
              <li class="social__item">
                <a href="https://api.whatsapp.com/send?phone=79213162621" target="_blank">
                  <span class="social__item__icon"><i class="fa fa-whatsapp"></i></span>
                  <span class="social__item__title">Whatsapp</span>
                  <span class="accessibility">Вы можете связаться с нами посредством Whatsapp</span>
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
              <p>Понедельник - Пятница</p>
              <p>10:00 - 18:00</p>
            </div>
          </div>
          
          <div class="show-mobile-only">
            <div class="address">
              <div class="address__title">
                <i class="fa fa-map-marker"></i>
                <span>Адрес:</span>
              </div>
              <div class="address__content">Санкт-Петербург, Южное Шоссе, 37 к.4 лит. Б</div>
            </div>
            
            <div class="entity">
              ООО Группа компаний "Буровые технологии"
              ИНН 7816318009
              ОГРН 1167847080565
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
            <ul  itemtype="http://schema.org/SiteNavigationElement">
              <li class="navigation__item navigation__item--home">
                <RouterLink to="/" aria-current="page" itemprop="url" class="nuxt-link-exact-active nuxt-link-active">
                    <span class="navigation__item__title">Главная</span>
                </RouterLink>
              </li>
              <li class="navigation__item">
                <RouterLink to="/Statji/StatjiPage" itemprop="url">
                    <span class="navigation__item__title">Статьи</span>
                </RouterLink>
              </li>
              <li class="navigation__item">
                  <RouterLink to="/Garantiya/GarantiyaPage" itemprop="url">
                      <span class="navigation__item__title">Гарантия</span>
                  </RouterLink>
              </li>
              <li class="navigation__item">
                  <RouterLink to="/Oplata/OplataPage" itemprop="url">
                      <span class="navigation__item__title">Оплата</span>
                  </RouterLink>
              </li>
              <li class="navigation__item">
                  <RouterLink to="/Dostavka/DostavkaPage" itemprop="url">
                      <span class="navigation__item__title">Доставка</span>
                  </RouterLink>
              </li>
              <li class="navigation__item">
                  <RouterLink to="/Okompanii/OkompaniiPage" itemprop="url">
                      <span class="navigation__item__title">О компании</span>
                  </RouterLink>
              </li>
              <li class="navigation__item">
                  <RouterLink to="/Kontakty/KontaktyPage" itemprop="url">
                      <span class="navigation__item__title">Контакты</span>
                  </RouterLink>
              </li>
            </ul>
          </nav>
          
          <nav class="categories categories--footer">
            <ul  itemtype="http://schema.org/SiteNavigationElement">
              <li class="categories__item">
                  <RouterLink to="/Catalog/CatalogPage" itemprop="url">
                      <span class="categories__item__title">Каталог</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-burovye-dolota" itemprop="url">
                      <span class="categories__item__title">Буровые долота</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-burilnye-truby" itemprop="url">
                      <span class="categories__item__title">Трубы для бурения скважин</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-perehodniki-burovye" itemprop="url">
                      <span class="categories__item__title">Переходники буровые</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-vrashshatelnoe-burenie" itemprop="url">
                      <span class="categories__item__title">Инструмент для вращательного бурения</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-kolonkovoe-burenie" itemprop="url">
                      <span class="categories__item__title">Инструмент для колонкового бурения</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-pnevmoudarnoe-burenie" itemprop="url">
                      <span class="categories__item__title">Инструмент для пневмоударного бурения</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-sharoshechnoe-burenie" itemprop="url">
                      <span class="categories__item__title">Инструмент для шарошечного бурения</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-shnekovoe-burenie" itemprop="url">
                      <span class="categories__item__title">Инструмент для шнекового бурения</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-dlya-bureniya-skvazhin-na-vodu" itemprop="url">
                      <span class="categories__item__title">Инструмент для бурения скважин на воду</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-vspomogatelnyj-instrument" itemprop="url">
                      <span class="categories__item__title">Вспомогательный инструмент</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-avarijnyj-instrument" itemprop="url">
                      <span class="categories__item__title">Аварийный инструмент</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-obustrojstvo-skvazhin" itemprop="url">
                      <span class="categories__item__title">Обустройство скважин</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-bentonit-polimery-smazki" itemprop="url">
                      <span class="categories__item__title">Бентонит, полимеры, смазки</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-burovye-nasosy" itemprop="url">
                      <span class="categories__item__title">Буровые насосы</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-zapasnye-chasti" itemprop="url">
                      <span class="categories__item__title">Запасные части</span>
                  </RouterLink>
              </li>
              <li class="categories__item">
                  <RouterLink to="/catalog/category-burovye-ustanovki" itemprop="url">
                      <span class="categories__item__title">Буровые установки</span>
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
            <div class="address__content">Санкт-Петербург, Южное Шоссе, 37 к.4 лит. Б</div>
          </div>
        </div>
        
        <div class="column column--right">
          <div class="entity">
            ООО Группа компаний "Буровые технологии"
            ИНН 7816318009
            ОГРН 1167847080565
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
    </div>
  </footer>
  
</template>

<style scoped>
</style>