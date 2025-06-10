<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';
import Form from './components/Form.vue';
import { useRoute } from 'vue-router';
import { useSeo } from '../../utils/seo';

defineOptions({
    name: 'DostavkaPage.vue'
})

// Получаем роутер и текущий маршрут
const route = useRoute();

// Инициализация SEO
useSeo({
  title: route.meta.title as string,
  description: route.meta.description as string,
  canonical: route.fullPath
});

// Хлебные крошки
const breadcrumbs = computed(() => [
  { title: 'Главная', url: '/' },
  { title: 'Доставка', url: '', isCurrent: true }
]);

// Создаем микроразметку для страницы доставки
const deliverySchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Доставка',
  'description': 'Информация о способах доставки оборудования для бурения',
  'mainEntity': {
    '@type': 'Service',
    'name': 'Доставка оборудования для бурения',
    'provider': {
      '@type': 'Organization',
      'name': 'Оборудование для бурения №1 в России'
    },
    'offers': {
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': 'Доставка оборудования',
        'description': 'Доставка осуществляется только по предоплате в любой регион РФ'
      },
      'price': '0',
      'priceCurrency': 'RUB',
      'availability': 'https://schema.org/InStock'
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Способы доставки',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Транспортная компания'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Самовывоз'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Почта России'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Доставка до адреса'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Бесплатная доставка',
            'description': 'При заказе на сумму свыше 100 000 руб.'
          }
        }
      ]
    }
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(deliverySchema.value)
    }
  ]
});
</script>

<template>
<main class="main">
    <div class="wrapper">
        <Breadcrumbs :items="breadcrumbs" />

        <article class="article post">
            <header><h1 class="title post__title">Доставка</h1></header>
            <div class="content post__content">
                <section>
                    <p>Доставка осуществляется только по предоплате в любой регион РФ.</p>
                    <h2>Способы доставки</h2>
                    <ul>
                        <li>Транспортная компания</li>

                        <li>Самовывоз</li>

                        <li>Почта России</li>

                        <li>Доставка до адреса</li>

                        <li>Бесплатно при условии заказа на сумму свыше 100 000 руб.</li>
                    </ul>
                    <p>Для выбора удобного способа доставки и расчета его стоимости с вами свяжется менеджер для уточнения всех данных</p>
                </section>
            </div>
        </article>
    </div>
    
    <section class="section cost">
        <div class="cost__overlay"></div>
        <div class="cost__inner">
            <div class="wrapper">
                <div class="row">
                    <div class="col col--left"><img src="/src/assets/img/cost.007c370.webp" alt="Рассчитать стоимость доставки" width="350" height="394" /></div>
                    <div class="col col--right">
                        <div class="cost__form">
                            <div class="cost__form__before">
                                <h3 class="cost__form__before__title">Рассчитать стоимость доставки</h3>
                                <p class="cost__form__before__description">Заполните форму, и наши специалисты рассчитают <span>стоимость доставки для вас</span></p>
                            </div>
                            <div class="row">
                                <div class="col col--right">

                                    <Form />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="wrapper">
       <Gratitude />
    </div>
</main>



</template>

<style lang="scss" scoped>
.cost {
  position:relative
}
.cost__overlay {
  position:absolute;
  top:30%;
  bottom:30%;
  left:0;
  right:0;
  background:#f1f3f6
}
.cost__inner .col--left {
  display:none
}
@media screen and (min-width:1024px) {
  .cost__inner .row {
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
    flex-wrap:wrap
  }
  .cost__inner .col--left {
    display:block;
    width:35rem
  }
//   .cost__inner .col--right {
//     width:calc(100% - 38rem)
//   }
}
@media screen and (min-width:1200px) {
  .cost__inner .row {
    padding-left:5vw;
    padding-right:5vw
  }
}
.cost__form {
  position:relative;
  padding:1.5rem;
  border-radius:1rem;
  margin-bottom:3rem;
  background:linear-gradient(223.06deg,#0cf 3.37%,#006079 100.96%);
  color:#fff
}
@media screen and (min-width:768px) {
  .cost__form {
    padding:3rem
  }
}
.cost__form__before {
  text-align:center;
  margin-bottom:3rem;
  line-height:1.2
}
.cost__form__before__title {
  font-size:1.6rem;
  margin-bottom:1.5rem
}
@media screen and (min-width:768px) {
  .cost__form__before {
    margin-bottom:4.5rem
  }
  .cost__form__before__title {
    font-size:2rem
  }
  .cost__form__before__description {
    font-size:1.6rem
  }
  .cost__form__before__description span {
    display:block
  }
}
.cost__form .form__row--action {
  text-align:center
}
@media screen and (min-width:1024px) {
  .cost__form .form__container {
    display:flex;
    flex-direction:row;
    position:relative
  }
  .cost__form .form__container:before {
    content:"";
    position:absolute;
    top:0;
    left:50%;
    bottom:0;
    width:.1rem;
    background-color:#fff;
    opacity:.5;
    transform:translateX(-50%)
  }
  .cost__form .form__container .form__col {
    flex-basis:50%
  }
  .cost__form .form__container .form__col--left {
    padding-right:4.5rem
  }
  .cost__form .form__container .form__col--right {
    padding-left:4.5rem
  }
  .cost__form .form__row--checkbox {
    flex-wrap:wrap
  }
  .cost__form .form__row--checkbox .checkbox {
    width:100%;
    padding-bottom:1.5rem
  }
}

</style>