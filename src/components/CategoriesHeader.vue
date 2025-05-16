<script setup lang="ts">
interface CategoryItem {
  href: string;
  iconSrc: string;
  iconAlt: string;
  title: string;
  isBasket?: boolean;
}

const categories: CategoryItem[] = [
  {
    href: "/Catalog/CategoryBurovyeDolota",
    iconSrc: "/image/4138f1.svg",
    iconAlt: "Перейти к Буровые долота",
    title: "Буровые долота"
  },
  {
    href: "/catalog/category-burilnye-truby",
    iconSrc: "/image/4138f1.svg",
    iconAlt: "Перейти к Трубы для бурения скважин",
    title: "Трубы для бурения скважин"
  },
  {
    href: "/catalog/category-perehodniki-burovye",
    iconSrc: "/image/4138f1.svg",
    iconAlt: "Перейти к Переходники буровые",
    title: "Переходники буровые"
  },
  {
    href: "/catalog/category-vrashshatelnoe-burenie",
    iconSrc: "/image/8cf2d3.svg",
    iconAlt: "Перейти к Инструмент для вращательного бурения",
    title: "Инструмент для вращательного бурения"
  },
  {
    href: "/catalog/category-kolonkovoe-burenie",
    iconSrc: "/image/f17657.svg",
    iconAlt: "Перейти к Инструмент для колонкового бурения",
    title: "Инструмент для колонкового бурения"
  },
  {
    href: "/catalog/category-pnevmoudarnoe-burenie",
    iconSrc: "/image/c0fc52.svg",
    iconAlt: "Перейти к Инструмент для пневмоударного бурения",
    title: "Инструмент для пневмоударного бурения"
  },
  {
    href: "/catalog/category-sharoshechnoe-burenie",
    iconSrc: "/image/0cbb3c.svg",
    iconAlt: "Перейти к Инструмент для шарошечного бурения",
    title: "Инструмент для шарошечного бурения"
  },
  {
    href: "/catalog/category-shnekovoe-burenie",
    iconSrc: "/image/b4113b.svg",
    iconAlt: "Перейти к Интрумент для шнекового бурения",
    title: "Интрумент для шнекового бурения"
  },
  {
    href: "/catalog/category-dlya-bureniya-skvazhin-na-vodu",
    iconSrc: "/image/4138f1.svg",
    iconAlt: "Перейти к Инструмент для бурения скважин на воду",
    title: "Инструмент для бурения скважин на воду"
  },
  {
    href: "/catalog/category-vspomogatelnyj-instrument",
    iconSrc: "/image/f7e482.svg",
    iconAlt: "Перейти к Вспомогательный инструмент",
    title: "Вспомогательный инструмент"
  },
  {
    href: "/catalog/category-avarijnyj-instrument",
    iconSrc: "/image/c2e082.svg",
    iconAlt: "Перейти к Аварийный инструмент",
    title: "Аварийный инструмент"
  },
  {
    href: "/catalog/category-obustrojstvo-skvazhin",
    iconSrc: "/image/919b76.svg",
    iconAlt: "Перейти к Обустройство скважин",
    title: "Обустройство скважин"
  },
  {
    href: "/catalog/category-bentonit-polimery-smazki",
    iconSrc: "/image/4138f1.svg",
    iconAlt: "Перейти к Бентонит, полимеры, смазки",
    title: "Бентонит, полимеры, смазки"
  },
  {
    href: "/catalog/category-burovye-nasosy",
    iconSrc: "/image/a19cb7.svg",
    iconAlt: "Перейти к Буровые насосы",
    title: "Буровые насосы"
  },
  {
    href: "/catalog/category-zapasnye-chasti",
    iconSrc: "/image/8197a9.svg",
    iconAlt: "Перейти к Запасные части",
    title: "Запасные части"
  },
  {
    href: "/catalog/category-burovye-ustanovki",
    iconSrc: "/image/0638dd.svg",
    iconAlt: "Перейти к Буровые установки",
    title: "Буровые установки"
  },
  {
    href: "/basket",
    iconSrc: "/image/d1bbbc.svg",
    iconAlt: "Перейти в корзину",
    title: "Корзина",
    isBasket: true
  }
];
</script>

<template>
  <nav class="categories categories--header">
    <ul itemtype="http://schema.org/SiteNavigationElement">
      <li 
        v-for="(item, index) in categories"
        :key="index" 
        class="categories__item"
      >
        <RouterLink 
          :to="item.href" 
          itemprop="url"
          custom
          v-slot="{ navigate, href }"
        > 
          <a 
            :href="href" 
            @click="navigate"
          >
            <span 
              :class="{
                'categories__item__icon': true,
                'categories__item__basket': item.isBasket
              }"
            >
              <img 
                :src="item.iconSrc" 
                width="92" 
                height="92" 
                :alt="item.iconAlt" 
                loading="lazy" 
              />
            </span>

            <!-- for basket-->
            <!-- <span class="categories__item__icon__basket__value">1</span> -->
             
            <span class="categories__item__title">{{ item.title }}</span>
          </a>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>