<script setup lang="ts">
import { computed } from 'vue';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import Gratitude from '../../components/Gratitude.vue';
import HekpForm from './components/HelpForm.vue';
import Map from './components/Map.vue';

defineOptions({
    name: 'KontaktyPage.vue'
})

// Хлебные крошки
const breadcrumbs = computed(() => [
  { title: 'Главная', url: '/' },
  { title: 'Контакты', url: '', isCurrent: true }
]);
</script>

<template>
<div>
    <main class="main">
        <div class="wrapper">
            <Breadcrumbs :items="breadcrumbs" />
            <article class="article post">
                <header><h1 class="title post__title">Контакты</h1></header>
                <div class="content post__content">
                    
                    <section class="section section__contacts">
                        <div class="row">
                            <div class="col col--ymap">
                                <Map />
                            </div>
                            <div class="col">
                                <div class="phones phones--contacts">
                                    <a href="tel:+78122427585" class="phones__item">
                                        <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
                                        <div><span class="phones__item__number">8 812 242 75 85</span> <span class="phones__item__office">Офис-склад СПБ-Юг</span></div>
                                    </a>
                                    <a href="tel:+78122427588" class="phones__item">
                                        <span class="phones__item__icon"><i class="fa fa-phone"></i></span>
                                        <div><span class="phones__item__number">8 812 242 75 88</span> <span class="phones__item__office">Офис-склад СПБ-Север</span></div>
                                    </a>
                                    
                                </div>
                                <div class="address">
                                    <div class="address__title"><span>Адрес:</span></div>
                                    <div class="address__content" style="padding-bottom: 1.5rem;">
                                        <span class="nl">Офис-склад Юг:</span> <span class="nl">Санкт-Петербург, Южное шоссе, 37 к.4 лит. Б,</span> <span class="nl">тел. <a href="tel:+79213717766">8 921 371 77 66</a></span>
                                    </div>
                                    <div class="address__content">
                                        <span class="nl">Офис-склад Север:</span> <span class="nl">Санкт-Петербург, Выборгское шоссе, 356,</span> <span class="nl">тел. <a href="tel:+79110369668">8 911 036 96 68</a></span>
                                    </div>
                                </div>
                                <div class="section__contacts__block">
                                    <div class="section__contacts__block__title">Пишите нам</div>
                                    <div class="social social--contacts">
                                        <ul>
                                            <li class="social__item">
                                                <a href="mailto:info@burspb.com" target="_blank">
                                                    <span class="social__item__icon"><i class="fa fa-envelope"></i></span> <span class="social__item__title">info@burspb.com</span>
                                                    <span class="accessibility">Вы можете связаться с нами посредством Email</span>
                                                </a>
                                            </li>
                                            <li class="social__item">
                                                <a href="https://t.me/bur_spb" target="_blank">
                                                    <span class="social__item__icon"><i class="fa fa-telegram"></i></span> <span class="social__item__title">Telegram</span>
                                                    <span class="accessibility">Вы можете связаться с нами посредством Telegram</span>
                                                </a>
                                            </li>
                                            <li class="social__item">
                                                <a href="https://api.whatsapp.com/send?phone=79213162621" target="_blank">
                                                    <span class="social__item__icon"><i class="fa fa-whatsapp"></i></span> <span class="social__item__title">Whatsapp</span>
                                                    <span class="accessibility">Вы можете связаться с нами посредством Whatsapp</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="section__contacts__block" style="padding-top: 4rem;">
                                    <div class="section__contacts__block__title">Реквизиты</div>
                                    <div class="section__contacts__block__description">
                                        <ul>
                                            <li>
                                                ООО ГК «Буровые технологии»

                                                <ul>
                                                    <li>
                                                        <span>ИНН</span>
                                                        7816318009
                                                    </li>
                                                    <li>
                                                        <span>КПП</span>
                                                        781601001
                                                    </li>
                                                    <li>
                                                        <span>ОГРН</span>
                                                        1167847080565
                                                    </li>
                                                    <li>
                                                        <span>ОКПО</span>
                                                        15190466
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span>Юридический адрес:</span>
                                                Россия, 192241 г. Санкт-Петербург, Южное шоссе 37, корпус 4
                                            </li>
                                            <li>
                                                <span>Банк:</span>
                                                Точка ПАО Банка «ФК ОТКРЫТИЕ»
                                            </li>
                                            <li>
                                                <span>Номер счёта:</span>
                                                40702810803500028018
                                            </li>
                                            <li>
                                                <span>Кор. счёт:</span>
                                                30101810845250000999
                                            </li>
                                            <li>
                                                <span>БИК:</span>
                                                044525999
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </article>
        </div>

        <HekpForm />
        
        <div class="wrapper">
            <Gratitude />
        </div>

    </main>
</div>

</template>

<style lang="scss" scoped>
.section__contacts .address__title,
.section__contacts .section__contacts__block__title {
  margin-bottom:1.5rem;
  color:#7b7e89;
  font-weight:700;
  font-size:1.8rem
}
.section__contacts .address__content {
  color:#2b2c30;
  font-size:1.6rem
}
.section__contacts .address__content a {
  text-decoration:none
}
.section__contacts .address,
.section__contacts .phones,
.section__contacts .section__contacts__block {
  margin-bottom:1.5rem
}
.section__contacts ul,
.section__contacts ul ul {
  list-style:none;
  padding:0;
  margin:0
}
.section__contacts ul ul {
  margin-bottom:1.5rem
}
.section__contacts ul ul li:first-child {
  padding-top:.75rem
}
.section__contacts li {
  padding:0 0 .75rem;
  margin:0;
  font-weight:700;
  font-size:1.6rem
}
.section__contacts li:last-child {
  padding-bottom:0
}
.section__contacts li span:not(.social__item__icon, .social__item__title) {
  color:#7b7e89
}
.post__content a {
    color: #005266;
}
@media screen and (min-width:768px) {
  .section__contacts .address__title,
  .section__contacts .section__contacts__block__title {
    margin-bottom:3rem;
    font-size:2.4rem
  }
  .section__contacts .address__content {
    font-size:1.8rem
  }
  .section__contacts .address,
  .section__contacts .phones,
  .section__contacts .section__contacts__block {
    margin-bottom:4.5rem
  }
  .section__contacts .phones {
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center
  }
  .section__contacts .phones__item {
    width:auto;
    margin:0 1.5rem
  }
  .section__contacts ul ul {
    margin-bottom:2.25rem
  }
  .section__contacts ul ul li:first-child {
    padding-top:1.5rem
  }
  .section__contacts li {
    padding:0 0 1.5rem;
    font-size:1.8rem
  }
}
@media screen and (min-width:1024px) {
  .section__contacts .row {
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    justify-content:space-between
  }
  .section__contacts .row .col {
    width:calc(50% - 3rem)
  }
  .section__contacts .row .col--ymap {
    width:50%
  }
  .section__contacts .phones {
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:flex-start
  }
  .section__contacts .phones__item {
    margin:0 1.5rem 0 0
  }
  .section__contacts .section__contacts {
    margin-bottom:6rem
  }
  .section__contacts .section__contacts__block {
    margin-bottom:0
  }
}
@media screen and (min-width:1200px) {
  .section__contacts .row .col {
    width:calc(45% - 4.5rem)
  }
  .section__contacts .row .col--ymap {
    width:55%
  }
}

</style>