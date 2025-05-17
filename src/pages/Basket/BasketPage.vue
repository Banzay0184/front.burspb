<script setup lang="ts">
import Breadcrumbs from '../../components/Breadcrumbs.vue';

</script>

<template>
  <main class="main">
    <div class="wrapper">
      <Breadcrumbs />
      <article class="post">
        <header>
          <h1 class="title post__title">Корзина</h1>
        </header>
        <section class="content post__content">
          <table class="basket__list">
            <tbody>
              <tr class="basket__list__item">
                <td class="basket__list__item__cell basket__list__item__cell--thumb">
                  <span style="background-image: url('https://burspb.com/api/files/ замок-350x350.jpg.webp');"></span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--title">
                  <a href="/catalog/product-burovoj-zamok-z-50-mtbsu" class="">
                    Буровой замок З-50 (М)ТБСУ
                  </a>
                  <span class="basket__list__item__cell--title-price">
                    Цена за ед. 2900 ₽
                  </span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--artikul">
                  <span class="basket__list__item__cell__title">Артикул:</span>
                  <span>00366</span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--weight"></td>
                <td class="basket__list__item__cell basket__list__item__cell--qty">
                  <div class="basket__qty">
                    <span class="basket__qty__action basket__qty__action--minus inactive">-</span>
                    <input type="number" min="1" class="input-number input-number--basket__qty">
                    <span class="basket__qty__action basket__qty__action--plus">+</span>
                  </div>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--price">
                  <span>2900 ₽</span>
                </td>
                <td class="basket__list__item__cell basket__list__item__cell--delete">
                  <button class="basket__list__item__cell__action basket__list__item__cell__action--delete">x</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="basket__summary">
            <div class="row">
              <div class="col col--left">
                <div>
                  <span class="basket__summary__title">Итого:</span>
                  <span class="basket__summary__value">2900 ₽</span>
                </div>
                <div>
                  <span class="basket__summary__title">Вес:</span>
                  <span class="basket__summary__value">0 кг</span>
                </div>
              </div>
              <div class="col col--right">
                <div>
                  <span class="button-wrapper">
                    <a href="/catalog" class="button button--blue button--outline">Продолжить
                      покупки</a>
                  </span>
                </div>
                <div>
                  <span class="button-wrapper">
                    <a href="/basket/confirm" class="button button--blue button--blue">Оформить
                      заказ</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
      <!-- If Basket Empty -->
      <article class="post">
        <header>
          <h1 class="title post__title">Корзина</h1>
        </header>
        <section class="content post__content">
          <div>
            <h3>Ваша корзина пуста</h3>
            <p>Выберите нужные позиции из каталога продукции и добавьте их в корзину</p>
            <div class="empty-basket-action"><span data-v-820233b6="" class="button-wrapper"><a data-v-820233b6=""
                  href="/catalog" class="button button--blue button--outline">В каталог →</a></span></div>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.empty-basket-action .button {
  width: auto;
  padding-left: 3rem;
  padding-right: 3rem;
  max-width: 30rem;
}
a.button {
  width: fit-content;
  text-decoration: none
}

a.button--blue {
  color: #fff
}

a.button--blue.button--outline {
  color: #006079
}

.basket__qty {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  line-height: 1
}

.basket__qty__action {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 50%;
  background: #006079;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer
}

.basket__qty__action:hover {
  background: #0cf
}

.basket__qty__action--minus {
  margin-right: .25rem
}

.basket__qty__action--minus.inactive {
  cursor: default
}

.basket__qty__action--minus.inactive:hover {
  background: #006079
}

.product__header .basket__qty__action--minus {
  margin-right: 1rem
}

.basket__qty__action--plus {
  margin-left: .25rem
}

.product__header .basket__qty__action--plus {
  margin-left: 1rem
}

@media screen and (min-width:1280px) {
  .basket__qty__action--minus {
    margin-right: 1rem
  }

  .basket__qty__action--plus {
    margin-left: 1rem
  }
}
</style>