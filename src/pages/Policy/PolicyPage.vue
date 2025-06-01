<script setup lang="ts">


defineOptions({
    name: 'PolicyPage.vue'
})
</script>

<template>
    <main class="main">
        <div class="wrapper">
            

            <div class="container">
                <div class="policy-content" itemscope itemtype="https://schema.org/WebPage">
                    <h1 itemprop="name">Политика конфиденциальности</h1>

                    <div itemprop="mainContentOfPage">
                        <p>ООО "БурТехСнаб" (далее — "Компания") уважает вашу конфиденциальность и стремится защищать ваши
                            персональные данные. Настоящая Политика конфиденциальности объясняет, как мы собираем,
                            используем и защищаем информацию о вас.</p>

                        <h2>1. Сбор информации</h2>
                        <p>Мы можем собирать следующие виды информации:</p>
                        <ul>
                            <li>Контактные данные (ФИО, адрес электронной почты, телефон)</li>
                            <li>Информация о компании (название, ИНН, юридический адрес)</li>
                            <li>Данные о заказах и платежах</li>
                            <li>Технические данные (IP-адрес, тип браузера, данные cookies)</li>
                        </ul>

                        <h2>2. Использование информации</h2>
                        <p>Собранная информация используется для следующих целей:</p>
                        <ul>
                            <li>Обработка заказов на поставку оборудования для бурения скважин</li>
                            <li>Предоставление информации о продукции и услугах</li>
                            <li>Улучшение качества обслуживания</li>
                            <li>Выполнение договорных обязательств</li>
                            <li>Соответствие требованиям законодательства</li>
                        </ul>

                        <h2>3. Защита информации</h2>
                        <p>Мы принимаем соответствующие меры безопасности для защиты вашей информации от
                            несанкционированного доступа, изменения, раскрытия или уничтожения. Это включает:</p>
                        <ul>
                            <li>Использование SSL-шифрования</li>
                            <li>Ограниченный доступ к персональным данным</li>
                            <li>Регулярный аудит систем безопасности</li>
                        </ul>

                        <h2>4. Передача данных третьим лицам</h2>
                        <p>Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением:</p>
                        <ul>
                            <li>Случаев, предусмотренных законодательством РФ</li>
                            <li>Партнеров, участвующих в выполнении договора (логистика, платежные системы)</li>
                            <li>С вашего явного согласия</li>
                        </ul>

                        <h2>5. Cookies и аналитика</h2>
                        <p>Наш сайт использует cookies для улучшения пользовательского опыта и сбора аналитических данных.
                            Вы можете отключить cookies в настройках браузера.</p>

                        <h2>6. Ваши права</h2>
                        <p>Вы имеете право:</p>
                        <ul>
                            <li>Запрашивать доступ к вашим персональным данным</li>
                            <li>Требовать исправления неточных данных</li>
                            <li>Отозвать согласие на обработку данных</li>
                            <li>Требовать удаления данных в случаях, предусмотренных законом</li>
                        </ul>

                        <h2>7. Контакты</h2>
                        <div itemscope itemtype="https://schema.org/Organization">
                            <p>По вопросам, связанным с обработкой персональных данных, обращайтесь:</p>
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

.policy-content {
    background-color: white;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

p {
    margin-bottom: 15px;
}

ul {
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

    .policy-content {
        padding: 20px;
    }
}
</style>