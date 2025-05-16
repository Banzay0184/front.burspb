<script setup lang="ts">
</script>

<template>
<form class="form">
  <div class="form__row">
      <label for="name" class="label">
          Имя

          
      </label>
      <input type="text" name="name" class="input" />
  </div>

  <div class="form__row">
      <label for="email" class="label">
          Почта

          
      </label>
      <input type="text" name="email" class="input" />
  </div>

  <div class="form__row">
      <label for="phone" class="label">
          Телефон

          
      </label>
      <input type="text" name="phone" class="input" />
  </div>

  <div class="form__row">
      <label for="message" class="label">
          Вопрос

          
      </label>
      <textarea name="message" class="input"></textarea>
  </div>
  <div class="form__row form__row--action"><button class="button button--blue button--cover">Отправить</button></div>
</form>
</template>