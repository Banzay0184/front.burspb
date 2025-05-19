<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '../../../api/api';

// Состояния для данных
const title = ref('Остались вопросы?');
const content = ref('Задайте свой вопрос, а мы постараемся на него ответить!');
const backgroundImage = ref('https://burspb.com/api/files/cover-help.jpg.webp');
const isLoading = ref(false);

// Состояния для формы
const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

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
    console.error('Ошибка при загрузке данных блока Help:', error);
  } finally {
    isLoading.value = false;
  }
};

// Обработка отправки формы
const handleSubmit = async (event: Event) => {
  event.preventDefault();
  
  try {
    // Проверка заполнения обязательных полей
    if (!form.value.name || !form.value.phone || !form.value.message) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    // Отправка данных через API
    const response = await apiService.actions.submitHelp({
      name: form.value.name,
      phone: form.value.phone,
      email: form.value.email,
      message: form.value.message
    });
    
    // Если успешно, очищаем форму
    if (response.status === 200) {
      form.value = {
        name: '',
        email: '',
        phone: '',
        message: ''
      };
      alert('Ваше сообщение успешно отправлено!');
    }
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте снова позже.');
  }
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
                    <div class="help-form__form formCover">
                        <form class="form" @submit="handleSubmit">
                            <div class="form__row">
                                <label for="name" class="label">
                                    Имя
                                </label>
                                <input 
                                  type="text" 
                                  id="name" 
                                  name="name" 
                                  class="input" 
                                  v-model="form.name" 
                                  required 
                                />
                            </div>

                            <div class="form__row">
                                <label for="email" class="label">
                                    Почта
                                </label>
                                <input 
                                  type="email" 
                                  id="email" 
                                  name="email" 
                                  class="input" 
                                  v-model="form.email" 
                                />
                            </div>

                            <div class="form__row">
                                <label for="phone" class="label">
                                    Телефон
                                </label>
                                <input 
                                  type="tel" 
                                  id="phone" 
                                  name="phone" 
                                  class="input" 
                                  v-model="form.phone" 
                                  required 
                                />
                            </div>

                            <div class="form__row">
                                <label for="message" class="label">
                                    Вопрос
                                </label>
                                <textarea 
                                  id="message" 
                                  name="message" 
                                  class="input" 
                                  v-model="form.message" 
                                  required
                                ></textarea>
                            </div>
                            <div class="form__row form__row--action">
                              <button type="submit" class="button button--blue button--cover">
                                Отправить
                              </button>
                            </div>
                        </form>
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