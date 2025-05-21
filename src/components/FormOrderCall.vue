<script setup lang="ts">
import { ref } from 'vue';
import PhoneInput from './PhoneInput.vue';
import apiService from '../api/api';

const emit = defineEmits<{
  (e: 'close'): void
}>();

const name = ref('');
const phone = ref('');
const nameError = ref(false);
const phoneError = ref(false);
const phoneErrorMessage = ref(''); // Добавляем ref для хранения сообщения об ошибке
const showSuccess = ref(false);
const submitInProgress = ref(false);
const successMessage = ref('');
const serverError = ref('');

const handleSubmit = async () => {
  // Сбрасываем ошибки перед валидацией
  nameError.value = false;
  phoneError.value = false;
  phoneErrorMessage.value = '';
  serverError.value = '';
  
  let isValid = true;
  
  if (!name.value.trim()) {
    nameError.value = true;
    isValid = false;
  }
  
  const cleanPhone = phone.value.replace(/\D/g, '');
  if (cleanPhone.length !== 11) {
    phoneError.value = true;
    phoneErrorMessage.value = 'Введите корректный телефон';
    isValid = false;
  }
  
  if (isValid) {
    submitInProgress.value = true;
    
    try {
      // Отправляем данные на сервер
      const response = await apiService.actions.submitCallMe({
        name: name.value.trim(),
        phone: phone.value
      });
      
      if (response.status === 200) {
        // Успешная отправка
        successMessage.value = response.data.message || 'Всё в порядке! Ваше сообщение успешно отправлено';
        showSuccess.value = true;
      } else {
        // Обработка ошибки с сервера
        serverError.value = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.';
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      serverError.value = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.';
    } finally {
      submitInProgress.value = false;
    }
  }
};

const clearNameError = () => {
  if (nameError.value) {
    nameError.value = false;
  }
};

const resetForm = () => {
  showSuccess.value = false;
  name.value = '';
  phone.value = '';
  nameError.value = false;
  phoneError.value = false;
  phoneErrorMessage.value = '';
  serverError.value = '';
  emit('close');
};

const handlePhoneError = (message: string) => {
  phoneErrorMessage.value = message;
};
</script>

<template>
    <form class="form" @submit.prevent="handleSubmit" v-if="!showSuccess">
        <h3 class="popup__inside__title">Заказать звонок</h3>
        <p class="popup__inside__message"></p>
        
        <!-- Серверная ошибка -->
        <div v-if="serverError" class="form__error form__error--server">
            {{ serverError }}
        </div>
        
        <div class="form__row">
            <label for="name" class="label">
                Имя
                <span v-if="nameError" class="form__error">
                    Введите ваше имя
                </span>
            </label>
            <input 
                type="text"
                name="name" 
                class="input" 
                v-model="name"
                @input="clearNameError"
            />
        </div>
        <div class="form__row">
            <label for="phone" class="label">
                Телефон
                <span v-if="phoneErrorMessage" class="form__error">
                    {{ phoneErrorMessage }}
                </span>
            </label>
            <PhoneInput
                v-model="phone"
                :error="phoneError"
                @update:error="(val) => phoneError = val"
                @error="handlePhoneError"
            />
        </div>
        <div class="form__row form__row--action">
            <button 
                type="submit" 
                class="button button--blue"
                :disabled="submitInProgress"
            >
                <span v-if="!submitInProgress">Отправить</span>
                <span v-else>Отправка...</span>
            </button>
        </div>
    </form>

    <div class="info" v-else>
        <h3 class="info__title">Всё в порядке!</h3>
        <p class="info__message">{{ successMessage }}</p>
        <button class="button button--unstyled" @click="resetForm">Ok</button>
    </div>

</template>

<style scoped lang="scss">
    .button {
        text-transform: uppercase;
        font-size: 1.4rem;
        max-width: 20rem;
        
        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    }
    .input {
        border-color: #ddd;
    }
    .form__row {
        margin-bottom: 0.75rem;

        @media screen and (min-width: 1024px) {
            margin-bottom: 1.5rem;
        }

        &--action {
            padding-top: 3rem;

            @media screen and (min-width: 1024px) {
                padding-top: 3.75rem;
            }
        }
    }
    .form__error {
        color: #f44336;
        font-size: 0.8rem;
        margin-left: 0.5rem;
        
        &--server {
            padding: 0.5rem;
            background-color: #ffebee;
            border-radius: 4px;
            margin-bottom: 1rem;
            text-align: center;
        }
    }
    .info {
        &__title {
            font-size: 1.6rem;
        }
        &__message {
            margin: 3rem 0;
        }
    }
</style>