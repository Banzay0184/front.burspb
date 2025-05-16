<script setup lang="ts">
interface PartnershipStep {
  id: number;
  image: string;
  alt: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

const steps: PartnershipStep[] = [
  {
    id: 1,
    image: "/image/2bb035.webp",
    alt: "partnership-01",
    title: "Оформление заказа",
    description: "Оформите заказ через сайт либо по телефону",
    width: 177,
    height: 204,
  },
  {
    id: 2,
    image: "/image/bd9265.webp",
    alt: "partnership-02",
    title: "Согласование",
    description: "Менеджер подтверждает информацию о заказе, его доставке и оплате",
    width: 177,
    height: 204,
  },
  {
    id: 3,
    image: "/image/ea907b.webp",
    alt: "partnership-03",
    title: "Выбор формы расчета",
    description: "Выбираем удобную для вас форму оплаты",
    width: 177,
    height: 204,
  },
  {
    id: 4,
    image: "/image/ce7f35.webp",
    alt: "partnership-04",
    title: "Доставка",
    description: "Доставляем заказ удобным для вас способом (ТК, курьерская служба)",
    width: 177,
    height: 204,
  },
];
</script>

<template>
  <section class="section partnership">
    <div class="section-title">
      <h3 class="section-title-tag">4 простых шага для сотрудничества</h3>
    </div>
    <ul class="partnership__list">
      <li v-for="step in steps" :key="step.id" class="partnership__list-item">
        <div class="partnership__item">
          <div class="partnership__item__image">
            <img
              :src="step.image"
              :width="step.width"
              :height="step.height"
              :alt="step.alt"
              loading="lazy"
            />
          </div>
          <h3 class="partnership__item__content__title">{{ step.title }}</h3>
          <p class="partnership__item__content__description">
            {{ step.description }}
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
</style>