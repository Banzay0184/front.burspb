<script setup lang="ts">
const gratitudeItems = [
  {
    icon: "/image/918c14.svg",
    title: "Крепкое сотрудничество",
    description: "Мы ценим сотрудничество с каждым клиентом нашей компании делаем всё, чтобы это сотрудничество было комфортным"
  },
  {
    icon: "/image/6ca9af.svg",
    title: "Комфортный сервис",
    description: "Полная консультация, быстрая доставка, широкий выбор товарной линейки и всесторонняя помощь наших специалистов - это получает каждый наш партнер."
  },
  {
    icon: "/image/bce4b0.svg",
    title: "Комплексный подход",
    description: "Наша команда оказывает всестороннюю поддержку при подборе, поставке, доставке, обслуживанию оборудования и даже обучению сотрудников наших клиентов."
  }
]
</script>

<template>
    <section class="section gratitude">
        <div class="row">
            <div class="col col--left gratitude__main">
                <div class="gratitude__main__image">
                    <img 
                        src="/image/44b0dc.webp" 
                        width="150" 
                        height="165" 
                        alt="gratitude" 
                        loading="lazy" 
                    />
                </div>
                <div class="gratitude__main__content">
                    <h3 class="gratitude__title">Спасибо за доверие</h3>
                    <div>
                        <p>Много полезной информации связанной с буровыми установками и инструментом для бурения вы можете найти в нашем разделе "Статьи"</p>
                        <p>
                            Дорогие друзья! Спасибо за выбор нашей компании, как поставщика буровых установок и инструмента. Мы ради сотрудничеству и надеемся, что у нас получится выстроить крепкие партнерские отношения на долгие годы.
                        </p>
                        <p>Каждый день мы стараемся сделать так, чтобы сотрудничество с нами было удобным. Для того, чтобы начать работать с нами, вам не нужно приезжать в офис для оформления заказа.</p>
                        <p>
                            Достаточно просто выбрать необходимое оборудование или инструмент на сайте и оформить заказ онлайн. А если у вас возникают вопросы или требуется консультация, наши специалисты с удовольствием проконсультируют
                            вас любым удобным способом коммуникации.
                        </p>
                        <p>Спасибо за доверие!</p>
                        <p>
                            Генеральный директор <span> ООО ГК "Буровые Технологии" <strong>Максим Жарнов</strong></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="col col--right gratitude__list">
                <ul>
                    <li v-for="(item, index) in gratitudeItems" :key="index">
                        <div class="gratitude__list__item">
                            <div class="gratitude__list__item__icon">
                                <img 
                                    :src="item.icon" 
                                    width="50" 
                                    height="73" 
                                    :alt="`gratitude-list-0${index + 1}`" 
                                    loading="lazy" 
                                />
                            </div>
                            <div class="gratitude__list__item__content">
                                <h3 class="slider__list__item__content__title">{{ item.title }}</h3>
                                <p class="slider__list__item__content__description">{{ item.description }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>