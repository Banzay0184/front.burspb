<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../../../api/api';
import PhoneInput from '../../../components/PhoneInput.vue';
import PrivacyCheckbox from '../../../components/PrivacyCheckbox.vue';

// Состояния для данных
const title = ref('Остались вопросы?');
const content = ref('Задайте свой вопрос, а мы постараемся на него ответить!');
const backgroundImage = ref('https://burspb.com/api/files/cover-help.jpg.webp');
const isLoading = ref(false);

// Состояния для формы
const name = ref('');
const email = ref('');
const phone = ref('');
const message = ref('');
const privacyAccepted = ref(false);

// Состояния для обработки формы
const submitInProgress = ref(false);
const showSuccess = ref(false);
const successMessage = ref('');
const serverError = ref('');

// Состояния для ошибок валидации
const nameError = ref(false);
const emailError = ref(false);
const phoneError = ref(false);
const messageError = ref(false);
const phoneErrorMessage = ref('');
const privacyError = ref(false);

// Получение данных из API
const fetchHelpData = async () => {
  isLoading.value = true;
  
  try {
    const response = await apiService.blocks.getHelp();
    
    if (response.data) {
      title.value = response.data.title || title.value;
      content.value = response.data.content || content.value;
      
      if (response.data.image) {
        // Используем WebP версию, если доступна
        backgroundImage.value = response.data.image.webp_full || 
                               response.data.image.full || 
                               backgroundImage.value;
      }
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

// Обработка отправки формы
const handleSubmit = async (event: Event) => {
  event.preventDefault();
  
  // Сброс ошибок перед валидацией
  nameError.value = false;
  emailError.value = false;
  phoneError.value = false;
  messageError.value = false;
  phoneErrorMessage.value = '';
  serverError.value = '';
  privacyError.value = false;
  
  // Валидация
  let isValid = true;
  
  // Проверка имени
  if (!name.value.trim()) {
    nameError.value = true;
    isValid = false;
  }
  
  // Проверка email (если введен)
  if (email.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      emailError.value = true;
      isValid = false;
    }
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

  // Проверка согласия с политикой
  if (!privacyAccepted.value) {
    privacyError.value = true;
    isValid = false;
  }
  
  // Если валидация прошла успешно, отправляем форму
  if (isValid) {
    submitInProgress.value = true;
    
    try {
      // Отправка данных через API
      const response = await apiService.actions.submitHelp({
        name: name.value.trim(),
        phone: phone.value,
        email: email.value.trim(),
        message: message.value.trim(),
        type: "Помощь"
      });
      
      if (response.status === 200) {
        // Если успешно, показываем сообщение
        successMessage.value = response.data.message || 'Всё хорошо! Ваша заявка отправлена';
        showSuccess.value = true;
        resetForm(false);
      } else {
        // Ошибка сервера
        serverError.value = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.';
      }
    } catch (error) {
      serverError.value = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.';
    } finally {
      submitInProgress.value = false;
    }
  }
};

// Очистка формы
const resetForm = (resetAll = true) => {
  name.value = '';
  email.value = '';
  phone.value = '';
  message.value = '';
  privacyAccepted.value = false;
  
  if (resetAll) {
    showSuccess.value = false;
    successMessage.value = '';
  }
  
  nameError.value = false;
  emailError.value = false;
  phoneError.value = false;
  messageError.value = false;
  phoneErrorMessage.value = '';
  serverError.value = '';
  privacyError.value = false;
};

// Создание новой заявки после успешной отправки
const createNewRequest = () => {
  showSuccess.value = false;
  successMessage.value = '';
  serverError.value = '';
};

// Обработчики снятия ошибок при вводе
const clearNameError = () => nameError.value = false;
const clearEmailError = () => emailError.value = false;
const clearMessageError = () => messageError.value = false;
// PhoneInput компонент сам обрабатывает очистку ошибок

// Обработчик ошибки телефона от компонента PhoneInput
const handlePhoneError = (message: string) => {
  phoneErrorMessage.value = message;
};

onMounted(() => {
  fetchHelpData();
});
</script>

<template>
    <section class="section help-form" :class="{ 'is-loading': isLoading }">
        <div class="help-form__inner" :style="{ 'background-image': `url('${backgroundImage}')` }">
            <div class="wrapper">
                <div>
                    <h3 class="help-form__inner__title">{{ title }}</h3>
                    <div class="help-form__inner__description"><p>{{ content }}</p></div>
                    
                    <div class="help-form__form formCover" v-if="!showSuccess">
                        <!-- Серверная ошибка -->
                        <div v-if="serverError" class="form__error form__error--server">
                          {{ serverError }}
                        </div>
                        
                        <form class="form" @submit.prevent="handleSubmit">
                            <div class="form__row">
                                <label for="name" class="label">
                                    Имя
                                    <span v-if="nameError" class="form__error">
                                        Введите ваше имя
                                    </span>
                                </label>
                                <input 
                                  type="text" 
                                  id="name" 
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
                                        Введите корректный email
                                    </span>
                                </label>
                                <input 
                                  type="email" 
                                  id="email" 
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
                                  id="message" 
                                  name="message" 
                                  class="input" 
                                  v-model="message"
                                  @input="clearMessageError"
                                ></textarea>
                            </div>

                            <PrivacyCheckbox
                              v-model="privacyAccepted"
                              :error="privacyError"
                            />

                            <div class="form__row form__row--action">
                              <button 
                                type="submit" 
                                class="button button--blue button--cover"
                                :disabled="submitInProgress"
                              >
                                <span v-if="!submitInProgress">Отправить</span>
                                <span v-else>Отправка...</span>
                              </button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="help-form__form formCover success-message" v-else>
                      <h3 class="success-message__title">Всё в порядке!</h3>
                      <p class="success-message__text">{{ successMessage }}</p>
                      <button 
                        class="button button--blue button--cover" 
                        @click="createNewRequest"
                      >
                        Новая заявка
                      </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.help-form {
  width:100%;
  height:auto;
  position:relative;
  
  &.is-loading {
    opacity: 0.8;
    transition: opacity 0.3s;
  }
}
.help-form__image {
  width:100%;
  padding-bottom:100%;
  background-size:cover;
  background-repeat:no-repeat;
  background-position:50%
}
@media (min-width:768px) {
  .help-form__image {
    padding-bottom:56.25%
  }
}
.help-form__inner {
  background-size:cover;
  background-repeat:no-repeat;
  background-position:50%;
  text-align:center;
  color:#fff;
  min-height:100vh;
  padding-top:15rem;
  padding-bottom:15rem
}
.help-form__inner__title {
  font-size:1.8rem;
  margin-bottom:.75rem;
  line-height:1.2
}
.help-form__inner__description {
  font-size:1.4rem;
  line-height:1.2;
  margin-bottom:1.5rem
}
.help-form__inner__description span {
  display:block
}
.help-form__inner__description p {
  font-size:1.4rem
}

.form__error {
  color: #f44336;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  
  &--server {
    padding: 0.5rem;
    background-color: rgba(255, 0, 0, 0.2);
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
    color: #fff;
  }
  
  &__text {
    margin-bottom: 2rem;
    color: #fff;
  }
}

@media screen and (min-width:768px) {
  .help-form__inner .wrapper>div {
    width:75%;
    max-width:70rem;
    margin:0 auto
  }
  .help-form__inner__title {
    font-size:2.4rem
  }
  .help-form__inner__description {
    font-size:1.6rem;
    margin-bottom:3rem
  }
  .help-form__inner__description p {
    font-size:1.6rem
  }
}
@media screen and (min-width:1024px) {
  .help-form__inner {
    padding-top:18rem;
    padding-bottom:18rem
  }
  .help-form__inner__title {
    font-size:3.2rem
  }
  .help-form__inner__description {
    font-size:1.8rem;
    margin-bottom:4.5rem
  }
  .help-form__inner__description p {
    font-size:1.8rem
  }
}
</style>