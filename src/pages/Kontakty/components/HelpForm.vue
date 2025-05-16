<script setup lang="ts">
</script>

<template>
    <section class="section help-form">
        <div class="help-form__inner" style="background-image: url('https://burspb.com/api/files/cover-help.jpg.webp');">
            <div class="wrapper">
                <div>
                    <h3 class="help-form__inner__title">Остались вопросы?</h3>
                    <div class="help-form__inner__description"><p>Задайте свой вопрос, а мы постараемся на него ответить!</p></div>
                    <div class="help-form__form formCover">
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
  position:relative
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