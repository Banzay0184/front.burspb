<script setup lang="ts">
import { ref } from 'vue';
import apiService from '../../../api/api';
import PhoneInput from '../../../components/PhoneInput.vue';

// Состояние формы
const name = ref('');
const email = ref('');
const phone = ref('');
const message = ref('');
const submitInProgress = ref(false);
const showSuccess = ref(false);
const successMessage = ref('');

// Состояние ошибок
const nameError = ref(false);
const emailError = ref(false);
const phoneError = ref(false);
const messageError = ref(false);
const serverError = ref('');

// Сообщения ошибок
const emailErrorMessage = ref('');
const phoneErrorMessage = ref('');

// Валидация и отправка формы
const handleSubmit = async () => {
  // Сброс ошибок перед валидацией
  nameError.value = false;
  emailError.value = false;
  phoneError.value = false;
  messageError.value = false;
  serverError.value = '';
  emailErrorMessage.value = '';
  phoneErrorMessage.value = '';
  
  // Валидация
  let isValid = true;
  
  // Проверка имени
  if (!name.value.trim()) {
    nameError.value = true;
    isValid = false;
  }
  
  // Проверка email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
    emailError.value = true;
    emailErrorMessage.value = 'Введите корректный email';
    isValid = false;
  }
  
  // Проверка телефона
  const cleanPhone = phone.value.replace(/\D/g, '');
  if (cleanPhone.length !== 11) {
    phoneError.value = true;
    phoneErrorMessage.value = 'Введите корректный телефон';
    isValid = false;
  }
  
  // Проверка сообщения
  if (!message.value.trim()) {
    messageError.value = true;
    isValid = false;
  }
  
  // Если валидация прошла успешно, отправляем форму
  if (isValid) {
    submitInProgress.value = true;
    
    try {
      // Отправка данных на сервер
      const response = await apiService.actions.submitHelp({
        name: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value,
        message: message.value.trim(),
        type: "Заказ гарантийного ремонта"
      });
      
      if (response.status === 200) {
        // Успешная отправка
        successMessage.value = response.data.message || 'Всё хорошо! Ваша заявка отправлена';
        showSuccess.value = true;
        resetForm(true);
      } else {
        // Ошибка сервера
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

// Очистка формы
const resetForm = (resetAll = true) => {
  if (resetAll) {
    name.value = '';
    email.value = '';
    phone.value = '';
    message.value = '';
    showSuccess.value = false;
    successMessage.value = '';
  }
  
  nameError.value = false;
  emailError.value = false;
  phoneError.value = false;
  messageError.value = false;
  serverError.value = '';
  emailErrorMessage.value = '';
  phoneErrorMessage.value = '';
};

// Обработчики снятия ошибок при вводе
const clearNameError = () => nameError.value = false;
const clearEmailError = () => { emailError.value = false; emailErrorMessage.value = ''; };
const clearPhoneError = () => { phoneError.value = false; phoneErrorMessage.value = ''; };
const clearMessageError = () => messageError.value = false;

// Обработчик ошибки телефона от компонента PhoneInput
const handlePhoneError = (message: string) => {
  phoneErrorMessage.value = message;
};
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit" v-if="!showSuccess">
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
      <label for="email" class="label">
        Почта
        <span v-if="emailError" class="form__error">
          {{ emailErrorMessage || 'Введите корректный email' }}
        </span>
      </label>
      <input 
        type="email" 
        name="email" 
        class="input" 
        v-model="email"
        @input="clearEmailError"
      />
    </div>

    <div class="form__row">
      <label for="phone" class="label">
        Телефон
        <span v-if="phoneError" class="form__error">
          {{ phoneErrorMessage || 'Введите корректный телефон' }}
        </span>
      </label>
      <PhoneInput
        v-model="phone"
        :error="phoneError"
        @update:error="(val) => phoneError = val"
        @error="handlePhoneError"
      />
    </div>

    <div class="form__row">
      <label for="message" class="label">
        Вопрос
        <span v-if="messageError" class="form__error">
          Введите ваш вопрос
        </span>
      </label>
      <textarea 
        name="message" 
        class="input" 
        v-model="message"
        @input="clearMessageError"
      ></textarea>
    </div>
    
    <div class="form__row form__row--action">
      <button 
        class="button button--blue button--cover"
        type="submit"
        :disabled="submitInProgress"
      >
        <span v-if="!submitInProgress">Отправить</span>
        <span v-else>Отправка...</span>
      </button>
    </div>
  </form>
  
  <div class="form success-message" v-else>
    <h3 class="success-message__title">Всё в порядке!</h3>
    <p class="success-message__text">{{ successMessage }}</p>
    <button 
      class="button button--blue" 
      @click="() => resetForm(true)"
    >
      Новая заявка
    </button>
  </div>
</template>

<style scoped lang="scss">
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

.button {
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.success-message {
  text-align: center;
  padding: 20px;
  
  &__title {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
  
  &__text {
    margin-bottom: 2rem;
  }
}
</style>