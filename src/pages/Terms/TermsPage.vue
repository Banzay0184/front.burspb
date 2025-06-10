<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useSeo } from '../../utils/seo';

// Получаем роутер и текущий маршрут
const route = useRoute();

// Инициализация SEO
useSeo({
  title: route.meta.title as string,
  description: route.meta.description as string,
  canonical: route.fullPath
});

defineOptions({
    name: 'TermsPage.vue'
})
</script>

<template>
    <main class="main">
        <div class="wrapper">
          

            <div class="container">
                <div class="terms-content" itemscope itemtype="https://schema.org/WebPage">
                    <h1 itemprop="name">Пользовательское соглашение</h1>

                    <div itemprop="mainContentOfPage">
                        <p>Настоящее Пользовательское соглашение (далее — "Соглашение") регулирует отношения между ООО
                            "БурТехСнаб" (далее — "Компания") и пользователями (далее — "Пользователь") в рамках
                            использования сайта и услуг по поставке оборудования для бурения скважин.</p>

                        <h2>1. Общие положения</h2>
                        <ol>
                            <li>Используя сайт и услуги Компании, Пользователь соглашается с условиями настоящего
                                Соглашения.</li>
                            <li>Компания оставляет за собой право изменять условия Соглашения без предварительного
                                уведомления.</li>
                            <li>Действующая версия Соглашения всегда доступна на сайте Компании.</li>
                        </ol>

                        <h2>2. Условия использования сайта</h2>
                        <ol>
                            <li>Пользователь обязуется не использовать сайт для незаконных или запрещенных целей.</li>
                            <li>Запрещается пытаться получить несанкционированный доступ к системам сайта.</li>
                            <li>Все материалы сайта защищены авторским правом и не могут быть использованы без разрешения
                                Компании.</li>
                        </ol>

                        <h2>3. Условия поставки оборудования</h2>
                        <ol>
                            <li>Все заказы на поставку оборудования оформляются в соответствии с действующим прайс-листом.
                            </li>
                            <li>Компания оставляет за собой право изменять цены и ассортимент без предварительного
                                уведомления.</li>
                            <li>Сроки поставки указываются в договоре и могут изменяться в зависимости от наличия товара.
                            </li>
                            <li>Поставка оборудования осуществляется на условиях, указанных в спецификации к договору.</li>
                        </ol>

                        <h2>4. Оплата и возврат</h2>
                        <ol>
                            <li>Оплата производится в соответствии с условиями, указанными в договоре.</li>
                            <li>Возврат оборудования возможен в течение 14 дней с момента поставки при условии сохранения
                                товарного вида и упаковки.</li>
                            <li>Оборудование, изготовленное по индивидуальному заказу, возврату и обмену не подлежит.</li>
                        </ol>

                        <h2>5. Гарантийные обязательства</h2>
                        <ol>
                            <li>Гарантийный срок на оборудование устанавливается производителем и указывается в
                                сопроводительных документах.</li>
                            <li>Гарантия не распространяется на повреждения, вызванные неправильной эксплуатацией
                                оборудования.</li>
                            <li>Для предъявления претензий по гарантии необходимо предоставить товарный чек и гарантийный
                                талон.</li>
                        </ol>

                        <h2>6. Ответственность</h2>
                        <ol>
                            <li>Компания не несет ответственности за ущерб, возникший в результате неправильного
                                использования оборудования.</li>
                            <li>Компания не гарантирует бесперебойную работу сайта и не несет ответственности за временные
                                технические сбои.</li>
                            <li>Пользователь несет ответственность за достоверность предоставленной информации при
                                оформлении заказа.</li>
                        </ol>

                        <h2>7. Конфиденциальность</h2>
                        <p>Обработка персональных данных Пользователя осуществляется в соответствии с Политикой
                            конфиденциальности, размещенной на сайте.</p>

                        <h2>8. Заключительные положения</h2>
                        <ol>
                            <li>Все споры разрешаются путем переговоров, а при недостижении согласия - в судебном порядке по
                                месту нахождения Компании.</li>
                            <li>Если какое-либо положение Соглашения будет признано недействительным, это не повлияет на
                                действительность остальных положений.</li>
                            <li>Соглашение вступает в силу с момента начала использования сайта или услуг Компании.</li>
                        </ol>

                        <div itemscope itemtype="https://schema.org/Organization">
                            <p>По всем вопросам обращайтесь:</p>
                            <p itemprop="name">ООО "БурТехСнаб"<br>
                                Email: <a href="mailto:info@burtehsnab.ru" itemprop="email">info@burtehsnab.ru</a><br>
                                Телефон: <a href="tel:+7XXXXXXXXXX" itemprop="telephone">+7 (XXX) XXX-XX-XX</a></p>
                        </div>

                        <p><em>Дата последнего обновления: <time itemprop="dateModified" datetime="2023-01-01">01 января 2023 года</time></em></p>
                    </div>
                </div>
            </div>

           
        </div>
    </main>


</template>

<style lang="scss" scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    background-color: #005792;
    color: white;
    padding: 20px 0;
    margin-bottom: 30px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 24px;
    font-weight: bold;
}

.logo span {
    color: #ffc107;
}

h1 {
    color: #005792;
    margin-bottom: 20px;
    font-size: 28px;
}

h2 {
    color: #005792;
    margin: 25px 0 15px;
    font-size: 22px;
}

.terms-content {
    background-color: white;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

p {
    margin-bottom: 15px;
}

ul,
ol {
    margin-bottom: 15px;
    padding-left: 20px;
}

li {
    margin-bottom: 8px;
}

footer {
    background-color: #333;
    color: white;
    padding: 20px 0;
    margin-top: 40px;
    text-align: center;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.footer-section {
    flex: 1;
    min-width: 250px;
    margin-bottom: 20px;
}

.footer-section h3 {
    margin-bottom: 15px;
    color: #ffc107;
}

.copyright {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #555;
    margin-top: 20px;
}

@media (max-width: 768px) {

    .header-content,
    .footer-content {
        flex-direction: column;
        text-align: center;
    }

    .terms-content {
        padding: 20px;
    }
}
</style>