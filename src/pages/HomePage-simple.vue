<template>
  <div>
    <h2>Главная страница</h2>
    <p>Это тестовая главная страница для проверки SSG</p>
    <ul>
      <li><router-link to="/catalog">Каталог</router-link></li>
      <li><router-link to="/o-kompanii">О компании</router-link></li>
      <li><router-link to="/kontakty">Контакты</router-link></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Мета-теги управляются через router.meta
</script>

<style scoped>
h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}
</style> 