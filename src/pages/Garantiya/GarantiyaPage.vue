<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';
import Form from './components/Form.vue';

    defineOptions({
      name: 'GarantiyaPage.vue'
    })

// Хлебные крошки
const breadcrumbs = computed(() => [
  { title: 'Главная', url: '/' },
  { title: 'Гарантия', url: '', isCurrent: true }
]);

// Создаем микроразметку для страницы гарантии
const warrantySchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Гарантия',
  'description': 'Информация о гарантийном обслуживании оборудования для бурения',
  'mainEntity': {
    '@type': 'Service',
    'name': 'Гарантийное обслуживание',
    'provider': {
      '@type': 'Organization',
      'name': 'ООО ГК "Буровые технологии"',
      'description': 'Весь ассортимент каталога компании сертифицирован заводами производителей и имеет гарантию'
    },
    'serviceType': 'Гарантийное обслуживание',
    'areaServed': 'Российская Федерация',
    'description': 'В случае возникновения гарантийного случая с оборудованием обратитесь в компанию по контактным номерам телефона или почте, либо заполните форму на этой странице. Наши сотрудники свяжутся с вами для уточнения всех деталей и обстоятельств и в кратчайшие сроки примут все необходимые действия для скорейшего ремонта или обмена товара ненадлежащего качества.',
    'offers': {
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': 'Гарантийный ремонт',
        'description': 'Ремонт или обмен товара ненадлежащего качества'
      }
    }
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(warrantySchema.value)
    }
  ]
});
</script>

<template>
<main class="main">
    <div class="wrapper">
        <Breadcrumbs :items="breadcrumbs" />
    </div>
    <div class="wrapper">
        <article class="article post">
            <header><h1 class="title post__title">Гарантия</h1></header>           
            <div  class="content post__content">
                <section  class="post__content__section--warranty-content" style="background-image: url('https://burspb.com/api/files/slide.jpg');">
                    <div  class="post__content__section--warranty-content__overlay"></div>
                    <div  class="post__content__section--warranty-content__content">
                        <p>Весь ассортимент каталога компании ООО ГК "Буровые технологии" сертифицирован заводами производителей и имеет гарантию.</p>
                        <p>
                            Гарантийный срок на приобретаемую продукцию указан в сертификате. В случае возникновения гарантийного случая с оборудованием обратитесь в компанию по контактным номерам телефона или почте, либо заполните форму на
                            этой странице.
                        </p>
                        <p>Наши сотрудники свяжутся с вами для уточнения всех деталей и обстоятельств и в кратчайшие сроки примут все необходимые действия для скорейшего ремонта или обмена товара ненадлежащего качества.</p>
                    </div>
                </section>
                <section  class="post__content__section--warranty-form">
                    <div  class="post__content__section--warranty-form__inner">
                        <h3  class="post__content__section--warranty-form__inner__title">Заказать <span >гарантийный ремонт</span></h3>
                        <div  class="help-form__form">

                          <Form />
                            
                        </div>
                    </div>
                </section>
            </div>
        </article>
    </div>
    
    <div class="wrapper">
       <Gratitude />
    </div>

</main>

</template>

<style lang="scss" scoped>
@media screen and (min-width:768px) {
  .post__content {
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    margin-bottom:4.5rem
  }
  .post__content__section--warranty-content {
    width:60%;
    max-width:94rem;
    flex-basis:60%
  }
  .post__content__section--warranty-form {
    margin-left:3rem;
    margin-bottom:0;
    width:calc(40% - 3rem);
    flex-basis:calc(40% - 3rem)
  }
}
@media screen and (min-width:1024px) {
  .post__content__section--warranty-content {
    width:65%;
    flex-basis:65%
  }
  .post__content__section--warranty-form {
    margin-left:4.5rem;
    width:calc(35% - 4.5rem);
    flex-basis:calc(35% - 4.5rem)
  }
}
.post__content__section--warranty-content {
  position:relative;
  border-radius:1rem;
  overflow:hidden;
  padding:1.5rem 1.5rem 40%;
  background-size:100% auto;
  background-position:bottom;
  background-repeat:no-repeat;
  margin-bottom:3rem
}
.post__content__section--warranty-content__overlay {
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  z-index:2;
  background:linear-gradient(180deg,#f1f3f5 75%,rgba(241,243,245,.25))
}
.post__content__section--warranty-content__content {
  position:relative;
  z-index:3
}
@media screen and (min-width:768px) {
  .post__content__section--warranty-content {
    padding:3rem 3rem 20%
  }
  .post__content__section--warranty-content__overlay {
    background:linear-gradient(180deg,#f1f3f5 60%,rgba(241,243,245,.25))
  }
}
@media screen and (min-width:1024px) {
  .post__content__section--warranty-content {
    padding:4.5rem 4.5rem 20%;
    border-radius:1.5rem
  }
}
.post__content__section--warranty-form {
  padding:1.5rem;
  border-radius:1rem;
  margin-bottom:3rem;
  background:linear-gradient(223.06deg,#0cf 3.37%,#006079 100.96%);
  color:#fff;
  text-align:center
}
.post__content__section--warranty-form__inner {
  margin:0 auto
}
.post__content__section--warranty-form__inner__title span {
  display:block
}
@media screen and (min-width:768px) {
  .post__content__section--warranty-form {
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    width:100%
  }
  .post__content__section--warranty-form__inner {
    min-width:100%
  }
}
@media screen and (min-width:1024px) {
  .post__content__section--warranty-form {
    padding:3rem 4.5rem;
    border-radius:1.5rem
  }
}

</style>