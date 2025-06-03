<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import FormOrderCall from './FormOrderCall.vue';

interface Props {
    isVisible: boolean;
    disableContent?: boolean;
    overlayClass?: string | Array<unknown> | object;
}

const { isVisible, overlayClass } = defineProps<Props>();
const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};

// Создаем микроразметку для модального окна
const modalSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Форма заказа',
  'description': 'Форма для быстрого заказа товара',
  'mainEntity': {
    '@type': 'WebPageElement',
    'name': 'Модальное окно заказа',
    'description': 'Форма для быстрого заказа товара',
    'isAccessibleForFree': true,
    'inLanguage': 'ru-RU'
  }
}));

// Добавляем микроразметку в head
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(modalSchema.value)
    }
  ]
});
</script>

<template>
    <Teleport to="#app">
        <div v-if="isVisible" :class="['popup', overlayClass]" @click="close">
            <div class="popup__inside" @click.stop>
                <span class="popup__close" @click="close">x</span>
                <FormOrderCall @close="close" />
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>


<style scoped lang="scss">
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        z-index: 10000;

        &__inside {
            position: relative;
            padding: 3rem 1.5rem;
            background: #fff;
            width: 90%;
            min-width: 28rem;
            max-width: 38rem;
            text-align: center;
            border-radius: 0.5rem;

            @media screen and (min-width: 768px) {
                padding: 3rem;
                border-radius: 1rem;
            }

            @media screen and (min-width: 1200px) {
                padding: 4.5rem;
                border-radius: 1.5rem;
            }

            &__title {
                font-size: 1.6rem;
            }

            &__message {
                margin: 3rem 0;
            }
        
        }

        &__close {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            border-radius: 50%;
            border: thin solid #ccc;
            font-size: 1.2rem;
            cursor: pointer;
            color: #ccc;
            width: 1.8rem;
            height: 1.8rem;
            line-height: 1.2rem;
            text-align: center;

            @media screen and (min-width: 1200px) {
                width: 2rem;
                height: 2rem;
                font-size: 1.4rem;
                line-height: 1.4rem;
            }
        }
    }
</style>
