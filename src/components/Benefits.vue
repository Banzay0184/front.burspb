<script setup lang="ts">
interface BenefitItem {
  icon: string;
  alt: string;
  title: string;
  description: string;
}

const benefits: BenefitItem[] = [
  {
    icon: "/image/479440.svg",
    alt: "benefits-01",
    title: "Отвечаем за качество",
    description: "Вся поставляемая продукция и установки соответствуют высокому классу качества, что подтверждено сертификатами"
  },
  {
    icon: "/image/9e8e12.svg",
    alt: "benefits-02",
    title: "Гарантируем надежость",
    description: "Отвечаем за надежность каждого изделия гарантируя высокий класс продукции"
  },
  {
    icon: "/image/453b9d.svg",
    alt: "benefits-03",
    title: "Комплексный подход",
    description: "Помогаем Вам с самого знакомства, от выбора необходимого оборудования или установки, до обучения"
  },
  {
    icon: "/image/2a8c7a.svg",
    alt: "benefits-04",
    title: "Эффективность поставки",
    description: "Всё поставляемое оборудование идет с полным комплектом всех необходимых инструментов для работы"
  },
  {
    icon: "/image/fa4e0d.svg",
    alt: "benefits-05",
    title: "Доступнее конкурентов",
    description: "Держим цену на продукцию ниже рыночных за счет прямой работы с производителями, без посредников"
  }
];
</script>

<template>
    <section class="section benefits">
        <ul>
        <li v-for="(benefit, index) in benefits" :key="index">
            <div class="benefits__item">
            <div class="benefits__item__icon">
                <img 
                :src="benefit.icon" 
                width="56" 
                height="81" 
                :alt="benefit.alt" 
                loading="lazy" 
                />
            </div>
            <div class="benefits__item__content">
                <h3 class="benefits__item__content__title">{{ benefit.title }}</h3>
                <p class="benefits__item__content__description">{{ benefit.description }}</p>
            </div>
            </div>
        </li>
        </ul>
    </section>
</template>

<style scoped>
</style>