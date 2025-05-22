<script setup lang="ts">
import { ref } from 'vue';
import apiService from '../../../api/api';
import PhoneInput from '../../../components/PhoneInput.vue';

// Состояние формы
const firstName = ref('');
const lastName = ref('');
const city = ref('');
const address = ref('');
const weight = ref('');
const phone = ref('');
const inn = ref('');
const showInnField = ref(false);
const userType = ref('individual'); // individual или legal
const paymentMethod = ref('cash'); // cash, card или bank

// Состояние отправки и успеха
const submitInProgress = ref(false);
const showSuccess = ref(false);
const successMessage = ref('');
const serverError = ref('');

// Состояние ошибок валидации
const firstNameError = ref(false);
const lastNameError = ref(false);
const cityError = ref(false);
const addressError = ref(false);
const weightError = ref(false);
const phoneError = ref(false);
const innError = ref(false);
const phoneErrorMessage = ref('');

// Обработчик выбора типа пользователя
const handleUserTypeChange = (type: string) => {
  userType.value = type;
  showInnField.value = type === 'legal';
  
  // Очистка поля ИНН при переключении на физ. лицо
  if (type === 'individual') {
    inn.value = '';
    innError.value = false;
  }
};

// Обработчик выбора способа оплаты
const handlePaymentMethodChange = (method: string) => {
  paymentMethod.value = method;
};

// Валидация и отправка формы
const handleSubmit = async (event: Event) => {
  event.preventDefault();
  
  // Сброс ошибок перед валидацией
  firstNameError.value = false;
  lastNameError.value = false;
  cityError.value = false;
  addressError.value = false;
  weightError.value = false;
  phoneError.value = false;
  innError.value = false;
  phoneErrorMessage.value = '';
  serverError.value = '';
  
  // Валидация
  let isValid = true;
  
  // Проверка имени
  if (!firstName.value.trim()) {
    firstNameError.value = true;
    isValid = false;
  }
  
  // Проверка фамилии
  if (!lastName.value.trim()) {
    lastNameError.value = true;
    isValid = false;
  }
  
  // Проверка города
  if (!city.value.trim()) {
    cityError.value = true;
    isValid = false;
  }
  
  // Проверка адреса
  if (!address.value.trim()) {
    addressError.value = true;
    isValid = false;
  }
  
  // Проверка веса
  if (!weight.value.trim() || isNaN(Number(weight.value))) {
    weightError.value = true;
    isValid = false;
  }
  
  // Проверка телефона
  const cleanPhone = phone.value.replace(/\D/g, '');
  if (cleanPhone.length !== 11) {
    phoneError.value = true;
    phoneErrorMessage.value = 'Введите корректный телефон';
    isValid = false;
  }
  
  // Проверка ИНН для юр. лиц
  if (userType.value === 'legal' && !inn.value.trim()) {
    innError.value = true;
    isValid = false;
  }
  
  // Если валидация прошла успешно, отправляем форму
  if (isValid) {
    submitInProgress.value = true;
    
    try {
      // Отправка данных на сервер
      const response = await apiService.actions.submitCost({
        first_name: firstName.value.trim(),
        last_name: lastName.value.trim(),
        phone: phone.value,
        address: address.value.trim(),
        city: city.value.trim(),
        inn: inn.value.trim(),
        payment: paymentMethod.value,
        type: userType.value,
        weight: weight.value
      });
      
      if (response.status === 200) {
        // Успешная отправка
        successMessage.value = response.data.message || 'Всё хорошо! Ваша заявка отправлена';
        showSuccess.value = true;
        resetForm();
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
const resetForm = () => {
  firstName.value = '';
  lastName.value = '';
  city.value = '';
  address.value = '';
  weight.value = '';
  phone.value = '';
  inn.value = '';
  userType.value = 'individual';
  paymentMethod.value = 'cash';
  showInnField.value = false;
  
  firstNameError.value = false;
  lastNameError.value = false;
  cityError.value = false;
  addressError.value = false;
  weightError.value = false;
  phoneError.value = false;
  innError.value = false;
  phoneErrorMessage.value = '';
};

// Создание новой заявки после успешной отправки
const createNewRequest = () => {
  showSuccess.value = false;
  successMessage.value = '';
  serverError.value = '';
};

// Обработчики снятия ошибок при вводе
const clearFirstNameError = () => firstNameError.value = false;
const clearLastNameError = () => lastNameError.value = false;
const clearCityError = () => cityError.value = false;
const clearAddressError = () => addressError.value = false;
const clearWeightError = () => weightError.value = false;
const clearInnError = () => innError.value = false;
// PhoneInput компонент сам обрабатывает очистку ошибок

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
    
    <div class="form__container">
        <div class="form__col form__col--left">
            <div class="form__row form__row--checkbox">
                <div 
                  class="checkbox" 
                  @click="handleUserTypeChange('individual')"
                >
                    <span class="checkbox__check" :class="{ 'checked': userType === 'individual' }">
                      <span class="checkbox__check__icon">✓</span>
                    </span> 
                    <span class="checkbox__title">Физическое лицо</span>
                </div>
                <div 
                  class="checkbox" 
                  @click="handleUserTypeChange('legal')"
                >
                    <span class="checkbox__check" :class="{ 'checked': userType === 'legal' }">
                      <span class="checkbox__check__icon">✓</span>
                    </span> 
                    <span class="checkbox__title">Юридическое лицо</span>
                </div>
            </div>
            
            <div class="form__row" v-if="showInnField">
                <label for="inn" class="label">
                    ИНН
                    <span v-if="innError" class="form__error">
                        Введите ИНН
                    </span>
                </label>
                <input 
                  type="text" 
                  name="inn" 
                  class="input input--number"
                  v-model="inn"
                  @input="clearInnError"
                >
            </div>

            <div class="form__row">
                <label for="first_name" class="label">
                    Имя
                    <span v-if="firstNameError" class="form__error">
                        Введите ваше имя
                    </span>
                </label>
                <input 
                  type="text" 
                  name="first_name" 
                  class="input" 
                  v-model="firstName"
                  @input="clearFirstNameError"
                />
            </div>

            <div class="form__row">
                <label for="last_name" class="label">
                    Фамилия
                    <span v-if="lastNameError" class="form__error">
                        Введите вашу фамилию
                    </span>
                </label>
                <input 
                  type="text" 
                  name="last_name" 
                  class="input" 
                  v-model="lastName"
                  @input="clearLastNameError"
                />
            </div>

            <div class="form__row">
                <label for="city" class="label">
                    Город
                    <span v-if="cityError" class="form__error">
                        Введите город
                    </span>
                </label>
                <input 
                  type="text" 
                  name="city" 
                  class="input" 
                  v-model="city"
                  @input="clearCityError"
                />
            </div>

            <div class="form__row">
                <label for="address" class="label">
                    Адрес
                    <span v-if="addressError" class="form__error">
                        Введите адрес
                    </span>
                </label>
                <input 
                  type="text" 
                  name="address" 
                  class="input" 
                  v-model="address"
                  @input="clearAddressError"
                />
            </div>
        </div>
        <div class="form__col form__col--right">
            <div class="form__row">
                <label for="weight" class="label">
                    Вес
                    <span v-if="weightError" class="form__error">
                        Введите корректный вес
                    </span>
                </label>
                <input 
                  type="text" 
                  name="weight" 
                  class="input" 
                  v-model="weight"
                  @input="clearWeightError"
                />
            </div>

            <div class="form__row">
                <label for="phone" class="label">
                    Телефон
                    <span v-if="phoneError" class="form__error">
                        {{ phoneErrorMessage || 'Введите ваш номер телефона' }}
                    </span>
                </label>
                <PhoneInput
                  v-model="phone"
                  :error="phoneError"
                  @update:error="(val) => phoneError = val"
                  @error="handlePhoneError"
                />
            </div>

            <div class="form__row__before">Способ оплаты</div>
            <div class="form__row form__row--checkbox">
                <div 
                  class="checkbox" 
                  @click="handlePaymentMethodChange('cash')"
                >
                    <span class="checkbox__check" :class="{ 'checked': paymentMethod === 'cash' }">
                      <span class="checkbox__check__icon">✓</span>
                    </span> 
                    <span class="checkbox__title">Наличная</span>
                </div>
                <div 
                  class="checkbox" 
                  @click="handlePaymentMethodChange('bank')"
                >
                    <span class="checkbox__check" :class="{ 'checked': paymentMethod === 'bank' }">
                      <span class="checkbox__check__icon">✓</span>
                    </span> 
                    <span class="checkbox__title">Безналичная</span>
                </div>
                <div 
                  class="checkbox" 
                  @click="handlePaymentMethodChange('card')"
                >
                    <span class="checkbox__check" :class="{ 'checked': paymentMethod === 'card' }">
                      <span class="checkbox__check__icon">✓</span>
                    </span> 
                    <span class="checkbox__title">Карта</span>
                </div>
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
        </div>
    </div>
</form>

<div class="form success-message" v-else>
  <h3 class="success-message__title">Всё в порядке!</h3>
  <p class="success-message__text">{{ successMessage }}</p>
  <button 
    class="button button--blue" 
    @click="createNewRequest"
  >
    Новая заявка
  </button>
</div>
</template>

<style lang="scss" scoped>
.cost__form .form__row--action {
  text-align:center
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