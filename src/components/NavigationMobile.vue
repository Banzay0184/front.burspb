<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits(['close']);

const isExpanded = ref(false);

const toggleSubmenu = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
<nav class="navigation-mobile">
  <span 
      class="navigation-mobile__close"
      @click="emit('close')"
    >
      ×
    </span>
    <ul>
        <li class="navigation-mobile__item navigation-mobile__item--expanded">
            <span  class="as-link"
              @click="toggleSubmenu"
            >
                <span class="navigation-mobile__item__icon navigation-mobile__item__icon--icon-page-1"><img src="/image/e93b66.svg" width="28" height="28" alt="Перейти в каталог " loading="lazy" /></span>
                <span class="navigation-mobile__item__title">
                    Каталог

                    <span class="triangle"></span>
                </span>
            </span>
            <ul class="navigation-mobile__nested"
              :class="{ 'expanded': isExpanded }"
            >
                <li>
                    <RouterLink to="/catalog/category-burovye-dolota">
                        Буровые долота
                    </RouterLink>
                    <ul>
                        <li>
                            <RouterLink to="/catalog/category-pdc-doloto" itemprop="url">
                                PDC долото
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-lopastnye" itemprop="url">
                                Лопастные долота
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-sharoshechnye" itemprop="url">
                                Шарошечные долота
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-shnekovye-burovye-dolota" itemprop="url">
                                Шнековые долота
                            </RouterLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <RouterLink to="/catalog/category-burilnye-truby">
                        Трубы для бурения скважин
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-tbsu" itemprop="url">
                                ТБСУ
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-burovye-shtangi" itemprop="url">
                                Буровые штанги
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-truby-burilnye-dlya-mgbu" itemprop="url">
                                Трубы бурильные для МГБУ
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-burovye-zamki" itemprop="url">
                                Буровые замки
                            </RouterLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <RouterLink to="/catalog/category-perehodniki-burovye">
                        Переходники буровые
                    </RouterLink>
                    <ul>
                        <li>
                            <RouterLink to="/catalog/category-perehodnik-perevodnoj" itemprop="url">
                                Переходники переводные Н, М, НН, ММ, НМ
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-perehodnik-pk" itemprop="url">
                                Переходники ПК
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-frezernye-perehodniki" itemprop="url">
                                Фрезерные переходники П, П-1
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-kolonkovoe-burenie">
                        Инструмент для колонкового бурения
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-kolonkovye-truby" itemprop="url">
                                Колонковые трубы
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-koronki-tverdosplavnye" itemprop="url">
                                Коронки твердосплавные
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-ustrojstvo-dlya-izvlecheniya-kerna" itemprop="url">
                                Устройство для извлечения керна
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-nabor-dlya-kolonkovogo-bureniya" itemprop="url">
                                Набор для колонкового бурения
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-perehodnik-kolonkovyj" itemprop="url">
                                Переходники для колонковой бурильной трубы
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-vrashshatelnoe-burenie">
                        Инструмент для вращательного бурения
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-pikobury-dlya-bureniya" itemprop="url">
                                Пикобуры для бурения
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-burilnye-truby" itemprop="url">
                                Трубы для бурения скважин
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-pdc-doloto" itemprop="url">
                                PDC долото
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-sharoshechnye" itemprop="url">
                                Шарошечные долота
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-lopastnye" itemprop="url">
                                Лопастные долота
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-perehodniki-burovye" itemprop="url">
                                Переходники буровые
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-vspomogatelnyj-instrument" itemprop="url">
                                Вспомогательный инструмент
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-pnevmoudarnoe-burenie">
                        Инструмент для пневмоударного бурения
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-pnevmoudarnik" itemprop="url">
                                Пневмоударники
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-pnevmoudarnye-koronki" itemprop="url">
                                Пневмоударные коронки
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-snaryad-pnevmoudarny" itemprop="url">
                                Снаряд пневмоударный колонковый (СПК)
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-perehodnik-perevodnoj" itemprop="url">
                                Переходники переводные Н, М, НН, ММ, НМ
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-tbsu" itemprop="url">
                                ТБСУ
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-burovye-zamki" itemprop="url">
                                Буровые замки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-klyuch-sharnirnyj-kshs" itemprop="url">
                                Ключ шарнирный КШС
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-klyuch-otbojnyj" itemprop="url">
                                Ключ отбойный
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-sharoshechnoe-burenie">
                        Инструмент для шарошечного бурения
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-sharoshechnye" itemprop="url">
                                Шарошечные долота
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-pdc-doloto" itemprop="url">
                                PDC долото
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-perehodniki-burovye" itemprop="url">
                                Переходники буровые
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-burilnye-truby" itemprop="url">
                                Трубы для бурения скважин
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-vspomogatelnyj-instrument" itemprop="url">
                                Вспомогательный инструмент
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-dlya-bureniya-skvazhin-na-vodu">
                        Инструмент для бурения скважин на воду
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-burilnye-truby" itemprop="url">
                                Трубы для бурения скважин
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-pdc-doloto" itemprop="url">
                                PDC долото
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-shnekovye-burovye-dolota" itemprop="url">
                                Шнековые долота
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-sharoshechnye" itemprop="url">
                                Шарошечные долота
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-lopastnye" itemprop="url">
                                Лопастные долота
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-perehodniki-burovye" itemprop="url">
                                Переходники буровые
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-koronki-tverdosplavnye" itemprop="url">
                                Коронки твердосплавные
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-kolonkovye-truby" itemprop="url">
                                Колонковые трубы
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-gruntonosy" itemprop="url">
                                Грунтоносы
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-vspomogatelnyj-instrument" itemprop="url">
                                Вспомогательный инструмент
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-obsadnye-truby" itemprop="url">
                                Обсадные трубы
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-skvazhinnye-filtry" itemprop="url">
                                Скважинные фильтры
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-shnekovoe-burenie">
                        Интрумент для шнекового бурения
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-truba-dlya-shnekovogo-bureniya" itemprop="url">
                                Труба для шнекового бурения
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-shnekovye-burovye-dolota" itemprop="url">
                                Шнековые долота
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-shneki-burovye" itemprop="url">
                                Шнеки буровые
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-vspomogatelnyj-instrument" itemprop="url">
                                Вспомогательный инструмент
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-shtangi-shnekovye-vrashatel" itemprop="url">
                                Штанги шнековые
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-perehodniki-burovye" itemprop="url">
                                Переходники буровые
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-avarijnyj-instrument">
                        Аварийный инструмент
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-kolokol-lovilnyj" itemprop="url">
                                Колокол ловильный
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-metchiki-lovilnye" itemprop="url">
                                Метчики ловильные
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-vspomogatelnyj-instrument">
                        Вспомогательный инструмент
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-vilka-podkladnaya" itemprop="url">
                                Вилка подкладная
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-klyuch-otbojnyj" itemprop="url">
                                Ключ отбойный
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-klyuch-sharnirnyj-kshs" itemprop="url">
                                Ключ шарнирный КШС
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-homut-dlya-obsadnyh-trub" itemprop="url">
                                Хомут для обсадных труб
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-obustrojstvo-skvazhin">
                        Обустройство скважин
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-filtrovye-setki" itemprop="url">
                                Фильтровые сетки
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-skvazhinnye-ogolovki" itemprop="url">
                                Скважинные оголовки
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-obsadnye-truby" itemprop="url">
                                Обсадные трубы
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-skvazhinnye-nasosy" itemprop="url">
                                Скважинные насосы
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-skvazhinnye-filtry" itemprop="url">
                                Скважинные фильтры
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-gidroakkumulyatory" itemprop="url">
                                Гидроаккумуляторы
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-avtobaki" itemprop="url">
                                Автобаки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-truby-pnd" itemprop="url">
                                Трубы ПНД
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-fitingi" itemprop="url">
                                Фитинги
                            </RouterLink>
                        </li>
                        
                    </ul>
                </li>
                
                <li>
                    <RouterLink to="/catalog/category-bentonit-polimery-smazki">
                        Бентонит, полимеры, смазки
                    </RouterLink>
                    <ul>
                        
                        <li>
                            <RouterLink to="/catalog/category-bentonit" itemprop="url">
                                Бентонит
                            </RouterLink>
                        </li>
                        
                        <li>
                            <RouterLink to="/catalog/category-polimery" itemprop="url">
                                Полимеры буровые
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-smazki" itemprop="url">
                                Смазки буровые
                            </RouterLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <RouterLink to="/catalog/category-burovye-nasosy">
                        Буровые насосы
                    </RouterLink>
                    <ul>
                        <li>
                            <RouterLink to="/catalog/selection-burovye-nasosy-dlya-mgbu" itemprop="url">
                                Буровые насосы для МГБУ
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/selection-burovye-nasosy-nb4" itemprop="url">
                                Буровые насосы НБ4
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/selection-burovye-nasosy-nb200" itemprop="url">
                                Буровые насосы НБ200
                            </RouterLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <RouterLink to="/catalog/category-zapasnye-chasti">
                        Запасные части
                    </RouterLink>
                    <ul>
                        <li>
                            <RouterLink to="/catalog/category-dlya-burovyh-ustanovok" itemprop="url">
                                Запасные части для буровых установок
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-zapchasti-dlya-nasosov" itemprop="url">
                                Запчасти для буровых насосов
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-shesterenchatye-nasosy" itemprop="url">
                                Шестеренчатые насосы
                            </RouterLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <RouterLink to="/catalog/category-burovye-ustanovki">
                        Буровые установки
                    </RouterLink>
                    <ul>
                        <li>
                            <RouterLink to="/catalog/category-na-pricepe" itemprop="url">
                                Буровые установки на прицепе
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-ustanovki-pride" itemprop="url">
                                Буровые установки Pride
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-dlya-inzhenernyh-izyskanij" itemprop="url">
                                Буровые установки для инженерных изысканий
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-dlya-skvazhin" itemprop="url">
                                Буровые установки для скважин
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-ustanovki-mgbu" itemprop="url">
                                Буровые установки МГБУ
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-na-vodu" itemprop="url">
                                Буровые установки на воду
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-geologicheskie-ustanovki" itemprop="url">
                                Геологические буровые установки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-gidravlicheskie" itemprop="url">
                                Гидравлические буровые установки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-gusenichnye-ustanovki" itemprop="url">
                                Гусеничные буровые установки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-malogabaritnye-ustanovki" itemprop="url">
                                Малогабаритные буровые установки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-mini-ustanovki" itemprop="url">
                                Мини буровые установки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-mobilnye-ustanovki" itemprop="url">
                                Мобильные буровые установки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-perenosnye" itemprop="url">
                                Переносные буровые установки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-samohodnye-ustanovki" itemprop="url">
                                Самоходные гидравлические буровые установки
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/catalog/category-shnekovye" itemprop="url">
                                Шнековые буровые установки
                            </RouterLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
        <li class="navigation-mobile__item">
          <RouterLink to="/Statji/StatjiPage">
              <span class="navigation-mobile__item__icon"><img src="/image/a16de5.svg" width="28" height="28" alt="Перейти к статьям" loading="lazy" /></span> <span class="navigation-mobile__item__title">Статьи</span>
          </RouterLink>
        </li>
        <li class="navigation-mobile__item">
            <RouterLink to="/Garantiya/GarantiyaPage">
                <span class="navigation-mobile__item__icon"><img src="/image/4d5a09.svg" width="28" height="28" alt="Перейти к Гарантия" loading="lazy" /></span> <span class="navigation-mobile__item__title">Гарантия</span>
            </RouterLink>
        </li>
        <li class="navigation-mobile__item">
            <RouterLink to="/Oplata/OplataPage">
                <span class="navigation-mobile__item__icon"><img src="/image/d159ba.svg" width="28" height="28" alt="Перейти к Оплата" loading="lazy" /></span> <span class="navigation-mobile__item__title">Оплата</span>
            </RouterLink>
        </li>
        <li class="navigation-mobile__item">
            <RouterLink to="/Dostavka/DostavkaPage">
                <span class="navigation-mobile__item__icon"><img src="/image/3ff0cd.svg" width="28" height="28" alt="Перейти к Доставка" loading="lazy" /></span> <span class="navigation-mobile__item__title">Доставка</span>
            </RouterLink>
        </li>
        <li class="navigation-mobile__item">
            <RouterLink to="/Okompanii/OkompaniiPage">
                <span class="navigation-mobile__item__icon"><img src="/image/8774d1.svg" width="28" height="28" alt="Перейти к О компании" loading="lazy" /></span> <span class="navigation-mobile__item__title">О компании</span>
            </RouterLink>
        </li>
        <li class="navigation-mobile__item">
            <RouterLink to="/Kontakty/KontaktyPage">
                <span class="navigation-mobile__item__icon"><img src="/image/ec4772.svg" width="28" height="28" alt="Перейти к Контакты" loading="lazy" /></span> <span class="navigation-mobile__item__title">Контакты</span>
            </RouterLink>
        </li>
    </ul>
</nav>
</template>

<style scoped>
.navigation-mobile {
  background:#06313d;
  color:#fff;
  width:100%;
  height:100%;
  position:fixed;
  top:0;
  left:0;
  bottom:0;
  right:0;
  z-index:1000;
  overflow-y:auto;
  padding:3rem 3rem 12rem
}
.navigation-mobile .as-link,
.navigation-mobile a {
  color:#fff
}
.navigation-mobile .as-link:hover,
.navigation-mobile a:hover {
  color:#0cf
}
.navigation-mobile .as-link {
  cursor:pointer
}
.navigation-mobile__close {
  display:block;
  color:#fff;
  border-radius:50%;
  width:2.2rem;
  height:2.2rem;
  line-height:1.8rem;
  font-size:1.6rem;
  font-weight:600;
  text-align:center;
  border:thin solid #fff;
  cursor:pointer;
  position:absolute;
  top:3rem;
  right:3rem
}
.navigation-mobile__close:hover {
  color:#0cf;
  border-color:#0cf
}
.navigation-mobile__item {
  padding:0 0 1.5rem;
  text-transform:uppercase;
  font-weight:700;
  font-size:1.2rem;
  line-height:1.2rem
}
.navigation-mobile__item .as-link,
.navigation-mobile__item a {
  display:flex;
  flex-direction:row;
  align-items:center
}
.navigation-mobile__item__icon {
  display:inline-block;
  width:1.6rem;
  margin-right:1.05rem
}
.navigation-mobile__item__icon svg {
  width:100%;
  max-width:100%
}
.navigation-mobile__item__icon--icon-page-4 {
  width:1rem
}
.navigation-mobile__item__icon--icon-page-5,
.navigation-mobile__item__icon--icon-page-6 {
  width:1.3rem
}
.navigation-mobile__item--expanded .navigation-mobile__item__title {
  position:relative
}
.navigation-mobile__item--expanded .triangle {
  position:absolute;
  top:0;
  left:100%;
  display:inline-block;
  width:0;
  height:0;
  border-color:#0cf transparent transparent;
  border-style:solid;
  border-width:6px 4px 0;
  transform:translate(100%,50%)
}
.navigation-mobile__item--expanded .triangle.expanded {
  transform:rotate(180deg) translate(-100%,-50%)
}
.navigation-mobile__nested {
  display:none;
  font-weight:400;
  text-transform:none;
  font-size:1.4rem;
  margin-top:1.5rem
}
.navigation-mobile__nested li {
  margin-bottom:3rem;
  font-weight:600
}
.navigation-mobile__nested li:last-child {
  margin-bottom:0
}
.navigation-mobile__nested li ul {
  margin-top:1.5rem
}
.navigation-mobile__nested li ul li {
  display:flex;
  flex-direction:row;
  align-items:center;
  font-weight:400;
  margin-bottom:1.5rem
}
.navigation-mobile__nested li ul li:last-child {
  margin-bottom:0
}
.navigation-mobile__nested li ul li:before {
  content:"—";
  display:inline-block;
  margin-right:.8rem
}
.navigation-mobile__nested.expanded {
  display:block
}

</style>