<script setup lang="ts">
import { ref } from 'vue';

const showInnField = ref(false);

const handleCheckboxClick = (event: Event) => {
  const target = event.currentTarget as HTMLElement;
  const checkboxCheck = target.querySelector('.checkbox__check');
  
  if (!checkboxCheck) return;
  
  // Находим родительскую группу checkbox'ов
  const checkboxGroup = target.closest('.form__row--checkbox');
  
  if (!checkboxGroup) return;
  
  // Удаляем класс checked у всех checkbox'ов в группе
  checkboxGroup.querySelectorAll('.checkbox__check').forEach((el) => {
    el.classList.remove('checked');
  });
  
  // Добавляем класс checked только к текущему checkbox'у
  checkboxCheck.classList.add('checked');
  
  // Проверяем, выбран ли "Юридическое лицо"
  const isLegalEntity = target.textContent?.includes('Юридическое лицо');
  showInnField.value = !!isLegalEntity;
};
</script>

<template>
<form class="form">
    <div class="form__container">
        <div class="form__col form__col--left">
            <div class="form__row form__row--checkbox">
                <div class="checkbox" @click="handleCheckboxClick">
                    <span class="checkbox__check checked"><span class="checkbox__check__icon">✓</span></span> <span class="checkbox__title">Физическое лицо</span>
                </div>
                <div class="checkbox" @click="handleCheckboxClick">
                    <span class="checkbox__check"><span class="checkbox__check__icon">✓</span></span> <span class="checkbox__title">Юридическое лицо</span>
                </div>
            </div>
            
            <div class="form__row" v-if="showInnField">
                <label for="inn" class="label">
                    ИНН
                </label>
                <input type="text" name="inn" class="input input--number">
            </div>

            <div class="form__row">
                <label for="first_name" class="label">
                    Имя
                    <span class="form__error">
                        Введите ваше имя
                    </span>
                </label>
                <input type="text" name="first_name" class="input" />
            </div>

            <div class="form__row">
                <label for="last_name" class="label">
                    Фамилия
                    <span class="form__error">
                        Введите вашу фамилию
                    </span>
                </label>
                <input type="text" name="last_name" class="input" />
            </div>

            <div class="form__row">
                <label for="city" class="label">
                    Город
                    <span class="form__error">
                        Введите город
                    </span>
                </label>
                <input type="text" name="city" class="input" />
            </div>

            <div class="form__row">
                <label for="address" class="label">
                    Адрес
                    <span class="form__error">
                        Введите адрес
                    </span>
                </label>
                <input type="text" name="address" class="input" />
            </div>
        </div>
        <div class="form__col form__col--right">
            <div class="form__row">
                <label for="weight" class="label">
                    Вес
                    <span class="form__error">
                        Введите вес
                    </span>
                </label>
                <input type="text" name="weight" class="input" />
            </div>

            <div class="form__row">
                <label for="phone" class="label">
                    Телефон
                    <span class="form__error">
                        Введите ваш номер телефона
                    </span>
                </label>
                <input type="text" name="phone" class="input" />
            </div>

            <div class="form__row__before">Способ оплаты</div>
            <div class="form__row form__row--checkbox">
                <div class="checkbox" @click="handleCheckboxClick">
                    <span class="checkbox__check checked"><span class="checkbox__check__icon">✓</span></span> <span class="checkbox__title">Наличная</span>
                </div>
                <div class="checkbox" @click="handleCheckboxClick">
                    <span class="checkbox__check"><span class="checkbox__check__icon">✓</span></span> <span class="checkbox__title">Безналичная</span>
                </div>
                <div class="checkbox" @click="handleCheckboxClick">
                    <span class="checkbox__check"><span class="checkbox__check__icon">✓</span></span> <span class="checkbox__title">Карта</span>
                </div>
            </div>
            <div class="form__row form__row--action"><button class="button button--blue button--cover">Отправить</button></div>
        </div>
    </div>
</form>
</template>

<style lang="scss" scoped>
.cost__form .form__row--action {
  text-align:center
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