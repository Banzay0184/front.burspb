<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'CategoriesFull'
})

interface CategoryItem {
  id: number
  title: string
  href: string
  img: string
  alt: string
  subcategories?: {
    title: string
    href: string
  }[]
}

const categories: CategoryItem[] = [
  {
    id: 1,
    title: 'Буровые долота',
    href: '/catalog/category-burovye-dolota',
    img: '/image/4138f1.svg',
    alt: 'Перейти к Буровые долота',
    subcategories: [
      { title: 'PDC долото', href: '/catalog/category-pdc-doloto' },
      { title: 'Лопастные долота', href: '/catalog/category-lopastnye' },
      { title: 'Шарошечные долота', href: '/catalog/category-sharoshechnye' },
      { title: 'Шнековые долота', href: '/catalog/category-shnekovye-burovye-dolota' }
    ]
  },
  {
    id: 2,
    title: 'Трубы для бурения скважин',
    href: '/catalog/category-burilnye-truby',
    img: '/image/4138f1.svg',
    alt: 'Перейти к Трубы для бурения скважин',
    subcategories: [
      { title: 'ТБСУ', href: '/catalog/category-tbsu' },
      { title: 'Буровые штанги', href: '/catalog/category-burovye-shtangi' },
      { title: 'Трубы бурильные для МГБУ', href: '/catalog/category-truby-burilnye-dlya-mgbu' },
      { title: 'Буровые замки', href: '/catalog/category-burovye-zamki' }
    ]
  },
  {
    id: 3,
    title: 'Переходники буровые',
    href: '/catalog/category-perehodniki-burovye',
    img: '/image/4138f1.svg',
    alt: 'Перейти к Переходники буровые',
    subcategories: [
      { title: 'Переходники переводные Н, М, НН, ММ, НМ', href: '/catalog/category-perehodnik-perevodnoj' },
      { title: 'Переходники ПК', href: '/catalog/category-perehodnik-pk' },
      { title: 'Фрезерные переходники П, П-1', href: '/catalog/category-frezernye-perehodniki' }
    ]
  },
  {
    id: 4,
    title: 'Инструмент для колонкового бурения',
    href: '/catalog/category-kolonkovoe-burenie',
    img: '/image/f17657.svg',
    alt: 'Перейти к Инструмент для колонкового бурения',
    subcategories: [
      { title: 'Колонковые трубы', href: '/catalog/category-kolonkovye-truby' },
      { title: 'Коронки твердосплавные', href: '/catalog/category-koronki-tverdosplavnye' },
      { title: 'Устройство для извлечения керна', href: '/catalog/category-ustrojstvo-dlya-izvlecheniya-kerna' },
      { title: 'Набор для колонкового бурения', href: '/catalog/category-nabor-dlya-kolonkovogo-bureniya' },
      { title: 'Переходники для колонковой бурильной трубы', href: '/catalog/category-perehodnik-kolonkovyj' }
    ]
  },
  {
    id: 5,
    title: 'Инструмент для вращательного бурения',
    href: '/catalog/category-vrashshatelnoe-burenie',
    img: '/image/8cf2d3.svg',
    alt: 'Перейти к Инструмент для вращательного бурения',
    subcategories: [
      { title: 'Пикобуры для бурения', href: '/catalog/category-pikobury-dlya-bureniya' },
      { title: 'Трубы для бурения скважин', href: '/catalog/category-burilnye-truby' },
      { title: 'PDC долото', href: '/catalog/category-pdc-doloto' },
      { title: 'Шарошечные долота', href: '/catalog/category-sharoshechnye' },
      { title: 'Лопастные долота', href: '/catalog/category-lopastnye' },
      { title: 'Переходники буровые', href: '/catalog/category-perehodniki-burovye' },
      { title: 'Вспомогательный инструмент', href: '/catalog/category-vspomogatelnyj-instrument' }
    ]
  },
  {
    id: 6,
    title: 'Инструмент для пневмоударного бурения',
    href: '/catalog/category-pnevmoudarnoe-burenie',
    img: '/image/c0fc52.svg',
    alt: 'Перейти к Инструмент для пневмоударного бурения',
    subcategories: [
      { title: 'Пневмоударники', href: '/catalog/category-pnevmoudarnik' },
      { title: 'Пневмоударные коронки', href: '/catalog/category-pnevmoudarnye-koronki' },
      { title: 'Снаряд пневмоударный колонковый (СПК)', href: '/catalog/category-snaryad-pnevmoudarny' },
      { title: 'Переходники переводные Н, М, НН, ММ, НМ', href: '/catalog/category-perehodnik-perevodnoj' },
      { title: 'ТБСУ', href: '/catalog/category-tbsu' },
      { title: 'Буровые замки', href: '/catalog/category-burovye-zamki' },
      { title: 'Ключ шарнирный КШС', href: '/catalog/category-klyuch-sharnirnyj-kshs' },
      { title: 'Ключ отбойный', href: '/catalog/category-klyuch-otbojnyj' }
    ]
  },
  {
    id: 7,
    title: 'Инструмент для шарошечного бурения',
    href: '/catalog/category-sharoshechnoe-burenie',
    img: '/image/0cbb3c.svg',
    alt: 'Перейти к Инструмент для шарошечного бурения',
    subcategories: [
      { title: 'Шарошечные долота', href: '/catalog/category-sharoshechnye' },
      { title: 'PDC долото', href: '/catalog/category-pdc-doloto' },
      { title: 'Переходники буровые', href: '/catalog/category-perehodniki-burovye' },
      { title: 'Трубы для бурения скважин', href: '/catalog/category-burilnye-truby' },
      { title: 'Вспомогательный инструмент', href: '/catalog/category-vspomogatelnyj-instrument' }
    ]
  },
  {
    id: 8,
    title: 'Инструмент для бурения скважин на воду',
    href: '/catalog/category-dlya-bureniya-skvazhin-na-vodu',
    img: '/image/4138f1.svg',
    alt: 'Перейти к Инструмент для бурения скважин на воду',
    subcategories: [
      { title: 'Трубы для бурения скважин', href: '/catalog/category-burilnye-truby' },
      { title: 'PDC долото', href: '/catalog/category-pdc-doloto' },
      { title: 'Шнековые долота', href: '/catalog/category-shnekovye-burovye-dolota' },
      { title: 'Шарошечные долота', href: '/catalog/category-sharoshechnye' },
      { title: 'Лопастные долота', href: '/catalog/category-lopastnye' },
      { title: 'Переходники буровые', href: '/catalog/category-perehodniki-burovye' },
      { title: 'Коронки твердосплавные', href: '/catalog/category-koronki-tverdosplavnye' },
      { title: 'Колонковые трубы', href: '/catalog/category-kolonkovye-truby' },
      { title: 'Грунтоносы', href: '/catalog/category-gruntonosy' },
      { title: 'Вспомогательный инструмент', href: '/catalog/category-vspomogatelnyj-instrument' },
      { title: 'Обсадные трубы', href: '/catalog/category-obsadnye-truby' },
      { title: 'Скважинные фильтры', href: '/catalog/category-skvazhinnye-filtry' }
    ]
  },
  {
    id: 9,
    title: 'Интрумент для шнекового бурения',
    href: '/catalog/category-shnekovoe-burenie',
    img: '/image/b4113b.svg',
    alt: 'Перейти к Интрумент для шнекового бурения',
    subcategories: [
      { title: 'Труба для шнекового бурения', href: '/catalog/category-truba-dlya-shnekovogo-bureniya' },
      { title: 'Шнековые долота', href: '/catalog/category-shnekovye-burovye-dolota' },
      { title: 'Шнеки буровые', href: '/catalog/category-shneki-burovye' },
      { title: 'Вспомогательный инструмент', href: '/catalog/category-vspomogatelnyj-instrument' },
      { title: 'Штанги шнековые', href: '/catalog/category-shtangi-shnekovye-vrashatel' },
      { title: 'Переходники буровые', href: '/catalog/category-perehodniki-burovye' }
    ]
  },
  {
    id: 10,
    title: 'Аварийный инструмент',
    href: '/catalog/category-avarijnyj-instrument',
    img: '/image/c2e082.svg',
    alt: 'Перейти к Аварийный инструмент',
    subcategories: [
      { title: 'Колокол ловильный', href: '/catalog/category-kolokol-lovilnyj' },
      { title: 'Метчики ловильные', href: '/catalog/category-metchiki-lovilnye' }
    ]
  },
  {
    id: 11,
    title: 'Вспомогательный инструмент',
    href: '/catalog/category-vspomogatelnyj-instrument',
    img: '/image/f7e482.svg',
    alt: 'Перейти к Вспомогательный инструмент',
    subcategories: [
      { title: 'Вилка подкладная', href: '/catalog/category-vilka-podkladnaya' },
      { title: 'Ключ отбойный', href: '/catalog/category-klyuch-otbojnyj' },
      { title: 'Ключ шарнирный КШС', href: '/catalog/category-klyuch-sharnirnyj-kshs' },
      { title: 'Хомут для обсадных труб', href: '/catalog/category-homut-dlya-obsadnyh-trub' }
    ]
  },
  {
    id: 12,
    title: 'Обустройство скважин',
    href: '/catalog/category-obustrojstvo-skvazhin',
    img: '/image/919b76.svg',
    alt: 'Перейти к Обустройство скважин',
    subcategories: [
      { title: 'Фильтровые сетки', href: '/catalog/category-filtrovye-setki' },
      { title: 'Скважинные оголовки', href: '/catalog/category-skvazhinnye-ogolovki' },
      { title: 'Обсадные трубы', href: '/catalog/category-obsadnye-truby' },
      { title: 'Скважинные насосы', href: '/catalog/category-skvazhinnye-nasosy' },
      { title: 'Скважинные фильтры', href: '/catalog/category-skvazhinnye-filtry' },
      { title: 'Гидроаккумуляторы', href: '/catalog/category-gidroakkumulyatory' },
      { title: 'Автобаки', href: '/catalog/category-avtobaki' },
      { title: 'Трубы ПНД', href: '/catalog/category-truby-pnd' },
      { title: 'Фитинги', href: '/catalog/category-fitingi' }
    ]
  },
  {
    id: 13,
    title: 'Бентонит, полимеры, смазки',
    href: '/catalog/category-bentonit-polimery-smazki',
    img: '/image/4138f1.svg',
    alt: 'Перейти к Бентонит, полимеры, смазки',
    subcategories: [
      { title: 'Бентонит', href: '/catalog/category-bentonit' },
      { title: 'Полимеры буровые', href: '/catalog/category-polimery' },
      { title: 'Смазки буровые', href: '/catalog/category-smazki' }
    ]
  },
  {
    id: 14,
    title: 'Буровые насосы',
    href: '/catalog/category-burovye-nasosy',
    img: '/image/a19cb7.svg',
    alt: 'Перейти к Буровые насосы',
    subcategories: [
      { title: 'Буровые насосы для МГБУ', href: '/catalog/selection-burovye-nasosy-dlya-mgbu' },
      { title: 'Буровые насосы НБ4', href: '/catalog/selection-burovye-nasosy-nb4' },
      { title: 'Буровые насосы НБ200', href: '/catalog/selection-burovye-nasosy-nb200' }
    ]
  },
  {
    id: 15,
    title: 'Запасные части',
    href: '/catalog/category-zapasnye-chasti',
    img: '/image/8197a9.svg',
    alt: 'Перейти к Запасные части',
    subcategories: [
      { title: 'Запасные части для буровых установок', href: '/catalog/category-dlya-burovyh-ustanovok' },
      { title: 'Запчасти для буровых насосов', href: '/catalog/category-zapchasti-dlya-nasosov' },
      { title: 'Шестеренчатые насосы', href: '/catalog/category-shesterenchatye-nasosy' }
    ]
  },
  {
    id: 16,
    title: 'Буровые установки',
    href: '/catalog/category-burovye-ustanovki',
    img: '/image/0638dd.svg',
    alt: 'Перейти к Буровые установки',
    subcategories: [
      { title: 'Буровые установки на прицепе', href: '/catalog/category-na-pricepe' },
      { title: 'Буровые установки Pride', href: '/catalog/category-ustanovki-pride' },
      { title: 'Буровые установки для инженерных изысканий', href: '/catalog/category-dlya-inzhenernyh-izyskanij' },
      { title: 'Буровые установки для скважин', href: '/catalog/category-dlya-skvazhin' },
      { title: 'Буровые установки МГБУ', href: '/catalog/category-ustanovki-mgbu' },
      { title: 'Буровые установки на воду', href: '/catalog/category-na-vodu' },
      { title: 'Геологические буровые установки', href: '/catalog/category-geologicheskie-ustanovki' },
      { title: 'Гидравлические буровые установки', href: '/catalog/category-gidravlicheskie' },
      { title: 'Гусеничные буровые установки', href: '/catalog/category-gusenichnye-ustanovki' },
      { title: 'Малогабаритные буровые установки', href: '/catalog/category-malogabaritnye-ustanovki' },
      { title: 'Мини буровые установки', href: '/catalog/category-mini-ustanovki' },
      { title: 'Мобильные буровые установки', href: '/catalog/category-mobilnye-ustanovki' },
      { title: 'Переносные буровые установки', href: '/catalog/category-perenosnye' },
      { title: 'Самоходные гидравлические буровые установки', href: '/catalog/category-samohodnye-ustanovki' },
      { title: 'Шнековые буровые установки', href: '/catalog/category-shnekovye' }
    ]
  }
]

const activeCategory = ref<number | null>(null)

const toggleCategory = (id: number) => {
  activeCategory.value = activeCategory.value === id ? null : id
}
</script>

<template>
  <nav itemtype="http://schema.org/SiteNavigationElement" class="categories-full">
    <ul itemprop="about" itemtype="http://schema.org/ItemList">
      <li 
        v-for="category in categories" 
        :key="category.id"
        :class="{ active: activeCategory === category.id }"
        itemprop="itemListElement" 
        itemtype="http://schema.org/ItemList"
      >
        <a 
          :href="category.href" 
          itemprop="url" 
          class="categories-full__parent"
        >
          <span>
            <img 
              :src="category.img" 
              width="92" 
              height="92" 
              :alt="category.alt" 
              loading="lazy" 
            />
          </span>
          {{ category.title }}
        </a>
        <meta itemprop="name" content="Информация" />
        <i 
          class="categories-full__parent__mobile-action"
          @click.prevent="toggleCategory(category.id)"
        ></i>
        
        <ul 
          v-if="category.subcategories"
          itemprop="itemListElement" 
          itemtype="http://schema.org/ItemList"
        >
          <li 
            v-for="(subcategory, index) in category.subcategories" 
            :key="index"
            itemprop="itemListElement" 
            itemtype="http://schema.org/ItemList"
          >
            <a :href="subcategory.href" itemprop="url" class="">
              {{ subcategory.title }}
            </a>
            <meta itemprop="name" content="Учебные статьи" />
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
<style lang="scss" scoped>
.categories-full>ul>li {
  margin-bottom:3rem;
  position:relative
}
.categories-full>ul>li li {
  padding-left:5.3rem;
  margin-bottom:.75rem
}
@media screen and (max-width:1199.99px) {
  .categories-full>ul>li>ul {
    display:none
  }
  .categories-full>ul>li.active>ul {
    display:block
  }
}
.categories-full__parent {
  font-weight:700;
  display:flex;
  flex-direction:row;
  line-height:1.2
}
.categories-full__parent span {
  min-width:3.8rem;
  max-width:3.8rem;
  flex-basis:3.8rem;
  margin-right:1.5rem
}
.categories-full__parent span img,
.categories-full__parent span svg {
  width:100%;
  height:auto
}
.categories-full__parent span .icon-background {
  fill:#0cf
}
@media screen and (max-width:1199.999px) {
  .categories-full__parent__mobile-action {
    display:inline-block;
    position:absolute;
    top:0;
    right:0;
    width:2rem;
    height:2rem;
    border:thin solid #aaa;
    border-radius:50%;
    cursor:pointer
  }
  .categories-full__parent__mobile-action:before {
    line-height:1;
    content:"";
    font-family:FontAwesome;
    font-size:1rem;
    display:inline-block;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    color:#aaa
  }
  .active .categories-full__parent__mobile-action:before {
    transform:translate(-50%,-50%) rotate(180deg)
  }
}
@media screen and (min-width:768px) {
  .categories-full>ul {
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    margin-left:-2.25rem;
    margin-right:-2.25rem
  }
  .categories-full>ul>li {
    display:block;
    width:calc(50% - 4.5rem);
    margin-left:2.25rem;
    margin-right:2.25rem
  }
}
@media screen and (min-width:1200px) {
  .categories-full>ul {
    margin-left:-1.5rem;
    margin-right:-1.5rem
  }
  .categories-full>ul>li {
    width:calc(25% - 3rem);
    margin-left:1.5rem;
    margin-right:1.5rem
  }
}
</style>