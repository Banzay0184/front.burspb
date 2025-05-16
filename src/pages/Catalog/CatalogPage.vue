<script setup lang="ts">
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Pagination from '../../components/Pagination.vue';
import SectionTitleFilter from '../../components/SectionTitleFilter.vue';
import Cards from '../../components/Cards.vue';
import CategoriesFull from './components/CategoriesFull.vue';
import { ref } from 'vue';


const cardsList = ref([
  {
    id: 1,
    title: 'Сетка галунного плетения П-56 фильтров…',
    link: '/catalog/product-setka-filtrovaya-galunnogo-pleteniya-p-56',
    image: '/image/68ab2f.webp',
    alt: 'Описание для Сетка',
    available: true,
    articul: '00937',
    oldPrice: '1 470 ₽',
    currentPrice: '1 250 ₽',
    showOldPrice: true
  },
  {
    id: 2,
    title: 'Биополимер VIS',
    link: '/catalog/product-polimery',
    image: '/image/3a0410.webp',
    alt: 'Описание для Заголовок для: 1637',
    available: true,
    articul: '00790',
    oldPrice: ' ₽',
    currentPrice: '950 ₽',
    showOldPrice: false
  },
  {
    id: 3,
    title: 'Колонковые наборы.',
    link: '/catalog/product-kolonkovye-nabory',
    image: '/image/12e4e8.webp',
    alt: 'Описание для 999',
    available: true,
    articul: '01000',
    oldPrice: ' ₽',
    currentPrice: '12 200 ₽',
    showOldPrice: false
  },
  {
    id: 4,
    title: 'Переводник Н/М З-50хЗ-50 2 паза (под ш…',
    link: '/catalog/product-perevodnik-p-z-50xz-50-2-paza-pod-sharik-18-25',
    image: '/image/945b42.webp',
    alt: 'Описание для CR6_3352',
    available: true,
    articul: '00724',
    oldPrice: ' ₽',
    currentPrice: '3 600 ₽',
    showOldPrice: false
  },
  {
    id: 5,
    title: 'Коронки импрегнированные 93 мм',
    link: '/catalog/product-koronki-impregnirovannye-93-mm',
    image: '/image/5c917d.webp',
    alt: 'Описание для CR6_3376',
    available: true,
    articul: '00431',
    oldPrice: ' ₽',
    currentPrice: '7 000 ₽',
    showOldPrice: false
  },
  {
    id: 6,
    title: 'Труба фильтрующая ЭФВП Д 90мм',
    link: '/catalog/product-truba-filtruyushhaya-efvp',
    image: '/image/c11701.webp',
    alt: 'Описание для Заголовок для: 1646',
    available: true,
    articul: '00939',
    oldPrice: ' ₽',
    currentPrice: '1 100 ₽',
    showOldPrice: false
  },
  {
    id: 7,
    title: 'Коронка КТУ-2 112 мм.',
    link: '/catalog/product-koronka-ktu-2-112-mm',
    image: '/image/b937c7.webp',
    alt: 'Описание для Заголовок для: 1236',
    available: true,
    articul: '00443',
    oldPrice: ' ₽',
    currentPrice: '1 290 ₽',
    showOldPrice: false
  },
  {
    id: 8,
    title: 'Ключ отбойный МГБУ З-56',
    link: '/catalog/product-klyuch-otbojnyj-mgbu-z-56',
    image: '/image/734c8c.jpg',
    alt: 'Описание для Ключ отбойный МГБУ З-56',
    available: true,
    articul: '00386',
    oldPrice: ' ₽',
    currentPrice: '3 500 ₽',
    showOldPrice: false
  },
  {
    id: 9,
    title: 'Биополимер PAC-HV',
    link: '/catalog/product-bentolux-horizont-pac-hv',
    image: '/image/3a0410.webp',
    alt: 'Описание для Заголовок для: 1637',
    available: true,
    articul: '00789',
    oldPrice: ' ₽',
    currentPrice: '950 ₽',
    showOldPrice: false
  },
  {
    id: 10,
    title: 'Пневмоударник CIR-110',
    link: '/catalog/product-pnevmoudarnik-cir-110',
    image: '/image/f7146d.webp',
    alt: 'Описание для htmlimage1',
    available: false,
    articul: '00784',
    oldPrice: ' ₽',
    currentPrice: '26 000 ₽',
    showOldPrice: false
  },
  {
    id: 11,
    title: 'Коронки PDC 112 мм',
    link: '/catalog/product-koronki-pdc-112-mm',
    image: '/image/131a24.webp',
    alt: 'Описание для CR6_3411',
    available: true,
    articul: '00421',
    oldPrice: ' ₽',
    currentPrice: '5 400 ₽',
    showOldPrice: false
  },
  {
    id: 12,
    title: 'Труба бурильная стальная 60х5,0х1500 з…',
    link: '/catalog/product-truba-burilnaya-stalnaya-60x50x1500-z-50-mgbu',
    image: '/image/a98210.webp',
    alt: 'Описание для CR6_3539',
    available: true,
    articul: '00843',
    oldPrice: ' ₽',
    currentPrice: '4 200 ₽',
    showOldPrice: false
  },
  {
    id: 13,
    title: 'Труба бурильная стальная 60х5,0х1500 з…',
    link: '/catalog/product-truba-burilnaya-stalnaya-60x50x1500-z-56-mgbu',
    image: '/image/2bd6b6.webp',
    alt: 'Описание для CR6_3541',
    available: true,
    articul: '00874',
    oldPrice: ' ₽',
    currentPrice: '4 500 ₽',
    showOldPrice: false
  },
  {
    id: 14,
    title: 'Вилка подкладная МГБУ З-56',
    link: '/catalog/product-vilka-podkladnaya-mgbu-z-56',
    image: '/image/0a1df0.jpg',
    alt: 'Описание для вилка подкладная МГБУ З-56',
    available: true,
    articul: '00091',
    oldPrice: ' ₽',
    currentPrice: '3 500 ₽',
    showOldPrice: false
  },
  {
    id: 15,
    title: 'Трубы ПНД D-32х3,0 SDR 11 питьевая',
    link: '/catalog/product-truby-pnd-d-25d-32',
    image: '/image/0ca82d.webp',
    alt: 'Описание для a3eb59bf8f7bdf9ad2437a809e336f7a',
    available: true,
    articul: '00733',
    oldPrice: ' ₽',
    currentPrice: '70 ₽',
    showOldPrice: false
  },
  {
    id: 16,
    title: 'Переводник на вертлюг З-50,З-56',
    link: '/catalog/product-perevodnik-na-vertlyug',
    image: '/image/06f6d6.webp',
    alt: 'Описание для perevodniki-3-50-na-m48x2-ooo-pombur(500)',
    available: true,
    articul: '00587',
    oldPrice: ' ₽',
    currentPrice: '2 600 ₽',
    showOldPrice: false
  },
  {
    id: 17,
    title: 'Переводник переводной Н/Н З-50/З-63,5',
    link: '/catalog/product-perevodnik-perevodnoj-tipa-n-n-z-50-z-635',
    image: '/image/decad1.webp',
    alt: 'Описание для CR6_3359',
    available: true,
    articul: '00745',
    oldPrice: ' ₽',
    currentPrice: '3 800 ₽',
    showOldPrice: false
  },
  {
    id: 18,
    title: 'Нержавеющая сетка галунного плетения П…',
    link: '/catalog/product-nerzhaveyushhaya-setka-galunnogo-pleteniya-p-56',
    image: '/image/a71d6e.webp',
    alt: 'Описание для Заголовок для: 780',
    available: true,
    articul: '00931',
    oldPrice: ' ₽',
    currentPrice: '3 100 ₽',
    showOldPrice: false
  },
  {
    id: 19,
    title: 'Вилка подкладная З-50',
    link: '/catalog/product-vilka-podkladnaya-z-50',
    image: '/image/c9ad2c.jpg',
    alt: 'Описание для вилка подкладная З-50',
    available: true,
    articul: '00090',
    oldPrice: ' ₽',
    currentPrice: '4 300 ₽',
    showOldPrice: false
  },
  {
    id: 20,
    title: 'Фланец на редуктор З-50',
    link: '/catalog/product-flanec-na-reduktor-z-50-z-56-2',
    image: '/image/817952.webp',
    alt: 'Описание для CR6_3371',
    available: true,
    articul: '00944',
    oldPrice: ' ₽',
    currentPrice: '3 500 ₽',
    showOldPrice: false
  },
  {
    id: 21,
    title: 'Плунжер 4040.1161.212 (70 мм)',
    link: '/catalog/product-plunzher-4040-1161-212-70-mm',
    image: '/image/bccddc.webp',
    alt: 'Описание для CR6_3470',
    available: true,
    articul: '00778',
    oldPrice: ' ₽',
    currentPrice: '3 100 ₽',
    showOldPrice: false
  },
  {
    id: 22,
    title: 'Гидроцилиндр подъема вращателя 2-25-10…',
    link: '/catalog/product-gidrocilindr-podema-vrashhatelya-2-25-10-1',
    image: '/image/0e1e14.webp',
    alt: 'Описание для IMG_20210830_105540',
    available: true,
    articul: '00150',
    oldPrice: ' ₽',
    currentPrice: '185 000 ₽',
    showOldPrice: false
  },
  {
    id: 23,
    title: 'Коронка КТУ-2 151 мм.',
    link: '/catalog/product-koronka-ktu-2-151-mm',
    image: '/image/b937c7.webp',
    alt: 'Описание для Заголовок для: 1236',
    available: true,
    articul: '00445',
    oldPrice: ' ₽',
    currentPrice: '1 690 ₽',
    showOldPrice: false
  },
  {
    id: 24,
    title: 'Ключ отбойный З-50',
    link: '/catalog/product-klyuch-otbojnyj-z-50',
    image: '/image/779eff.jpg',
    alt: 'Описание для Гаврилла (1)',
    available: true,
    articul: '00385',
    oldPrice: ' ₽',
    currentPrice: '4 600 ₽',
    showOldPrice: false
  }
])

const cardsListAdditional = ref([
{
    id: 3,
    title: 'Фильтр готовый НПВХ 125х5,0х3000 (0,3…',
    link: '/catalog/Card-filtr-gotovyj-npvx-125x50x3000-03-shhelevoj',
    image: '/image/88c6e6.webp',
    alt: 'Описание для fb37d4fa6442e41b0084f8f98bb8fbd1',
    available: true,
    articul: '00925',
    oldPrice: '3 700 ₽',
    currentPrice: '3 300 ₽'
  },
  {
    id: 4,
    title: 'Фильтр готовый НПВХ 90х5,0х3000 (0,3)…',
    link: '/catalog/Card-filtr-gotovyj-npvx-90x50x3000-03-shhelevoj',
    image: '/image/88c6e6.webp',
    alt: 'Описание для fb37d4fa6442e41b0084f8f98bb8fbd1',
    available: true,
    articul: '00926',
    oldPrice: '3 000 ₽',
    currentPrice: '2 700 ₽'
  }
])

const addToCart = (id: number) => {
  console.log('Добавлено в корзину:', id)
  // Логика добавления в корзину
}
</script>

<template>
    <div class="main">
        <div class="wrapper category-products">

            <Breadcrumbs />

            <section class="section selected-products category-products__nav">
                <div class="section-title"><h1 class="section-title-tag">Каталог продукции</h1></div>
               <CategoriesFull/>
            </section>

            <section class="section selected-products">

                <SectionTitleFilter title="Товары каталога"/>

                <Cards
                  :initial-cards="cardsList" 
                  :additional-cards="cardsListAdditional"
                  :load-more="true"
                  @add-to-cart="addToCart"
                />

                <Pagination />

            </section>

        </div>
    </div>
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