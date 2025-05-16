<script setup lang="ts">
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import CategoryNested from '../../components/CategoryNested.vue';
import Pagination from '../../components/Pagination.vue';
import SectionTitleFilter from '../../components/SectionTitleFilter.vue';
import Cards from '../../components/Cards.vue';
import { ref } from 'vue';

const categories = [
  { title: "PDC долото", url: "/catalog/category-pdc-doloto" },
  { title: "Лопастные долота", url: "/catalog/category-lopastnye" },
  { title: "Шарошечные долота", url: "/catalog/category-sharoshechnye" },
  { title: "Шнековые долота", url: "/catalog/category-shnekovye-burovye-dolota" },
];

const cardsList = ref([
  {
    id: 1,
    title: 'Долото III лопастное Д170 З-88н (Пика…)',
    link: '/Catalog/CatalogDetail',
    image: '/image/767b6a.webp',
    alt: 'Описание для 200',
    available: true,
    articul: '00262',
    oldPrice: '',
    currentPrice: '9 800 ₽'
  },
  {
    id: 2,
    title: 'Долото лопастное для шнека Д151 Ш-55 (…)',
    link: '/catalog/product-doloto-lopastnoe-dlya-shneka-d151-sh-55-karernoe',
    image: '/image/2c3f96.webp',
    alt: 'Описание для CR6_3382',
    available: true,
    articul: '00345',
    oldPrice: '',
    currentPrice: '7 100 ₽'
  },
  {
    id: 3,
    title: 'Долото III лопастное Д151 З-88н (Уси…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d151-z-88n-usilennoe',
    image: '/image/d0a985.webp',
    alt: 'Описание для CR6_3407',
    available: true,
    articul: '00253',
    oldPrice: '',
    currentPrice: '11 100 ₽'
  },
  {
    id: 4,
    title: 'Долото III лопастное Д151 З-50м (Пика…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d151-z-50m-pika',
    image: '/image/9706f8.webp',
    alt: 'Описание для CR6_3388',
    available: true,
    articul: '00238',
    oldPrice: '',
    currentPrice: '9 720 ₽'
  },
  {
    id: 5,
    title: 'Долото III лопастное Д112 З-63,5н (Ус…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d112-z-635n-usilennoe',
    image: '/image/6221d4.webp',
    alt: 'Описание для CR6_3401',
    available: true,
    articul: '00219',
    oldPrice: '',
    currentPrice: '9 000 ₽'
  },
  {
    id: 6,
    title: 'Долото III лопастное Д112 З-63,5н (Пи…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d112-z-635n-pikabur',
    image: '/image/a8f89e.webp',
    alt: 'Описание для CR6_3391',
    available: true,
    articul: '00218',
    oldPrice: '',
    currentPrice: '8 050 ₽'
  },
  {
    id: 7,
    title: 'Долото III шарошечное 151 К-ЦВ З-88н',
    link: '/catalog/product-doloto-iii-sharoshechnoe-151-k-cv-z-88n',
    image: '/image/5a1341.webp',
    alt: 'Описание для doloto',
    available: true,
    articul: '00305',
    oldPrice: '',
    currentPrice: '36 000 ₽'
  },
  {
    id: 8,
    title: 'Долото III шарошечное 132 К-ЦВ З-63,5н',
    link: '/catalog/product-doloto-iii-sharoshechnoe-132-k-cv-z-635n',
    image: '/image/5fea15.webp',
    alt: 'Описание для Заголовок для: 1575',
    available: true,
    articul: '00297',
    oldPrice: '',
    currentPrice: '22 000 ₽'
  },
  {
    id: 9,
    title: 'Долото III шарошечное 112 Т-ЦВ З-63,5н',
    link: '/catalog/product-doloto-iii-sharoshechnoe-112-t-cv-z-635n',
    image: '/image/354a86.webp',
    alt: 'Описание для III76',
    available: true,
    articul: '00290',
    oldPrice: '',
    currentPrice: '18 000 ₽'
  },
  {
    id: 10,
    title: 'Долото III шарошечное 151 Т-ЦВ З-88н',
    link: '/catalog/product-doloto-iii-sharoshechnoe-151-t-cv-z-88n',
    image: '/image/354a86.webp',
    alt: 'Описание для III76',
    available: true,
    articul: '00307',
    oldPrice: '',
    currentPrice: '29 000 ₽'
  },
  {
    id: 11,
    title: 'Долото III лопастное Д190 З-88н (Пика…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d190-z-88n-pika',
    image: '/image/767b6a.webp',
    alt: 'Описание для 200',
    available: true,
    articul: '00268',
    oldPrice: '',
    currentPrice: '10 000 ₽'
  },
  {
    id: 12,
    title: 'Долото III лопастное Д190 З-88н (Чече…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d190-z-88n-chechenskoe',
    image: '/image/4f67f2.webp',
    alt: 'Описание для CR6_3408',
    available: true,
    articul: '00270',
    oldPrice: '',
    currentPrice: '9 998 ₽'
  },
  {
    id: 13,
    title: 'Долото III лопастное Д200 З-88н (Пика…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d200-z-88n-pika',
    image: '/image/767b6a.webp',
    alt: 'Описание для 200',
    available: true,
    articul: '00273',
    oldPrice: '',
    currentPrice: '11 900 ₽'
  },
  {
    id: 14,
    title: 'Долото III лопастное Д146 З-50м (Усил…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d146-z-50m-usilennoe',
    image: '/image/5e7f5b.webp',
    alt: 'Описание для CR6_3405',
    available: true,
    articul: '00230',
    oldPrice: '',
    currentPrice: '10 000 ₽'
  },
  {
    id: 15,
    title: 'Долото III шарошечное 93 Т-ЦВ З-50н',
    link: '/catalog/product-doloto-iii-sharoshechnoe-93-t-cv-z-50n',
    image: '/image/354a86.webp',
    alt: 'Описание для III76',
    available: true,
    articul: '00283',
    oldPrice: '',
    currentPrice: '13 000 ₽'
  },
  {
    id: 16,
    title: 'Долото III шарошечное 76 К-ЦВ З-42н',
    link: '/catalog/product-doloto-iii-sharoshechnoe-76-k-cv-z-42n',
    image: '/image/5fea15.webp',
    alt: 'Описание для Заголовок для: 1575',
    available: true,
    articul: '00280',
    oldPrice: '',
    currentPrice: '16 000 ₽'
  },
  {
    id: 17,
    title: 'Долото III лопастное Д170 З-50м (Пика…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d170-z-50m-pika',
    image: '/image/a13eb4.webp',
    alt: 'Описание для CR6_3409',
    available: true,
    articul: '00261',
    oldPrice: '',
    currentPrice: '8 000 ₽'
  },
  {
    id: 18,
    title: 'Долото III лопастное Д112 З-50н (Пика…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d112-z-50n-pika',
    image: '/image/61daf8.webp',
    alt: 'Описание для CR6_3381',
    available: true,
    articul: '00214',
    oldPrice: '',
    currentPrice: '7 498 ₽'
  },
  {
    id: 19,
    title: 'Долото III лопастное Д112 З-63,5н (Пи…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d112-z-635n-pika',
    image: '/image/c62a76.webp',
    alt: 'Описание для CR6_3378',
    available: true,
    articul: '00217',
    oldPrice: '',
    currentPrice: '7 800 ₽'
  },
  {
    id: 20,
    title: 'Долото III лопастное Д161 З-50м (Усил…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d161-z-50m-usilennoe',
    image: '/image/871141.webp',
    alt: 'Описание для CR6_3405',
    available: true,
    articul: '00257',
    oldPrice: '',
    currentPrice: '10 800 ₽'
  },
  {
    id: 21,
    title: 'Долото III шарошечное 112 К-ЦВ З-63,5н',
    link: '/catalog/product-doloto-iii-sharoshechnoe-112-k-cv-z-635n',
    image: '/image/5fea15.webp',
    alt: 'Описание для Заголовок для: 1575',
    available: true,
    articul: '00287',
    oldPrice: '',
    currentPrice: '24 000 ₽'
  },
  {
    id: 22,
    title: 'Долото III лопастное Д93 З-50н (Чече…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d93-z-50n-chechenskoe',
    image: '/image/635c09.webp',
    alt: 'Описание для CR6_3394',
    available: true,
    articul: '00199',
    oldPrice: '',
    currentPrice: '7 920 ₽'
  },
  {
    id: 23,
    title: 'Долото III лопастное Д215 З-50м (Пика…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d215-z-50m-pika',
    image: '/image/a13eb4.webp',
    alt: 'Описание для CR6_3409',
    available: true,
    articul: '00274',
    oldPrice: '',
    currentPrice: '11 000 ₽'
  },
  {
    id: 24,
    title: 'Долото III лопастное Д215 З-88н (Пика…)',
    link: '/catalog/product-doloto-iii-lopastnoe-d215-z-88n-pika',
    image: '/image/36781c.webp',
    alt: 'Описание для 215',
    available: true,
    articul: '00276',
    oldPrice: '',
    currentPrice: '11 900 ₽'
  }
]);

const cardsListAdditional = ref([
{
    id: 3,
    title: 'Фильтр готовый НПВХ 125х5,0х3000 (0,3…',
    link: '/catalog/Card-filtr-gotovyj-npvx-125x50x3000-03-shhelevoj',
    image: '/image/88c6e6.webp',
    alt: 'Описание для fb37d4fa6442e41b0084f8f98bb8fbd1',
    available: true,
    articul: '00925',
    oldPrice: '3 700 ₽',
    currentPrice: '3 300 ₽'
  },
  {
    id: 4,
    title: 'Фильтр готовый НПВХ 90х5,0х3000 (0,3)…',
    link: '/catalog/Card-filtr-gotovyj-npvx-90x50x3000-03-shhelevoj',
    image: '/image/88c6e6.webp',
    alt: 'Описание для fb37d4fa6442e41b0084f8f98bb8fbd1',
    available: true,
    articul: '00926',
    oldPrice: '3 000 ₽',
    currentPrice: '2 700 ₽'
  }
])

const addToCart = (id: number) => {
  console.log('Добавлено в корзину:', id)
  // Логика добавления в корзину
}

</script>

<template>
  <main class="main">
    <div class="wrapper category-products">

        <Breadcrumbs />

        <CategoryNested :items="categories" />

        <section class="section selected-products">

            <SectionTitleFilter  title="Буровые долота" />

            <Cards
                :initial-cards="cardsList" 
                :additional-cards="cardsListAdditional"
                :load-more="false"
                @add-to-cart="addToCart"
            />

           <Pagination />

        </section>

        <section class="section oes">
            
            <div class="content">
                <h2>Буровые долота для различных типов скважин: особенности выбора и применения</h2>
                <p>
                    Качественное буровое долото – основа успешного бурения любой скважины. В каталоге ГК "Буровые технологии" представлен широкий ассортимент долот для различных горно-геологических условий и типов бурения. Как эксклюзивный
                    дилер ведущих заводов-производителей, мы предлагаем только сертифицированный инструмент с гарантией качества по оптимальной стоимости.
                </p>
                <p>
                    Выбор бурового долота напрямую влияет на скорость проходки, срок службы оборудования и итоговые финансовые затраты на бурение скважины. Правильно подобранный инструмент позволяет существенно сократить время работ и
                    расход ресурсов даже в сложных геологических условиях.
                </p>
                <h3>Типы буровых долот и их применение</h3>
                <p>В зависимости от назначения и конструктивных особенностей долота для бурения подразделяются на несколько основных типов:</p>
                <ol>
                    <li><strong>Шарошечные долота</strong> – классический инструмент для бурения в породах средней и высокой твердости. Их конструкция включает вращающиеся шарошки с зубьями, обеспечивающие разрушение породы.</li>
                    <li><strong>PDC долота</strong> – оснащены поликристаллическими алмазными резцами, демонстрируют высокую производительность и долговечность при бурении мягких и средних пород.</li>
                    <li><strong>Алмазные долота</strong> – премиальный инструмент для бурения в особо твердых породах, обладают высокой износостойкостью и производительностью.</li>
                    <li><strong>Лопастные долота</strong> – эффективны для бурения в мягких породах, отличаются простотой конструкции и доступной ценой.</li>
                    <li><strong>Ложковые буры</strong> – специализированный инструмент для бурения скважин на воду в мягких грунтах.</li>
                </ol>
                <p>Каждый тип бурового долота имеет свои преимущества и ограничения, которые необходимо учитывать при выборе инструмента для конкретных условий бурения.</p>
                <h2>Факторы, влияющие на стоимость бурового долота</h2>
                <p>Цена долота для бурения скважин формируется под влиянием нескольких ключевых факторов:</p>
                <ul>
                    <li><strong>Тип и конструкция</strong> – PDC и алмазные долота обычно дороже шарошечных и лопастных аналогов</li>
                    <li><strong>Диаметр инструмента</strong> – чем больше диаметр, тем выше стоимость</li>
                    <li><strong>Материал изготовления</strong> – использование твердых сплавов и алмазных вставок увеличивает цену</li>
                    <li><strong>Производитель</strong> – долота от известных брендов с проверенным качеством стоят дороже</li>
                    <li><strong>Технологические особенности</strong> – наличие промывочных каналов, специальных покрытий и резьбовых соединений</li>
                </ul>
                <p>
                    При выборе долота важно соотносить его стоимость с предполагаемым объемом работ и типом грунта. Экономия на качестве инструмента часто приводит к повышенному износу бурового оборудования и увеличению времени проведения
                    работ.
                </p>
                <h3>Как правильно выбрать долото для бурения скважин на воду</h3>
                <p>Бурение скважин на воду имеет свою специфику, требующую особого подхода к выбору инструмента. При выборе долота следует учитывать:</p>
                <ul>
                    <li>Геологический разрез местности</li>
                    <li>Глубину залегания водоносного горизонта</li>
                    <li>Тип буровой установки</li>
                    <li>Требуемый диаметр скважины</li>
                    <li>Бюджет проекта</li>
                </ul>
                <p>Для неглубоких скважин в мягких грунтах оптимальным выбором будут ложковые буры или шнековые долота, в то время как для проходки твердых пород потребуются шарошечные или PDC долота.</p>
                <h2>Каталог долот для различных типов бурения</h2>
                <p>В ассортименте ГК "Буровые технологии" представлены различные виды бурового инструмента для решения любых задач:</p>
                <h3>Долота для бурения артезианских скважин</h3>
                <p>Артезианское бурение предполагает проходку глубоких скважин через различные типы пород. Для таких работ мы предлагаем:</p>
                <ul>
                    <li>Трехшарошечные долота с твердосплавными зубьями</li>
                    <li>PDC долота с поликристаллическими алмазными резцами</li>
                    <li>Комбинированные долота для смешанных пород</li>
                </ul>
                <h3>Буры для малогабаритных буровых установок</h3>
                <p>Малогабаритные буровые установки широко применяются при бурении в ограниченном пространстве или труднодоступных местах. Для таких установок мы предлагаем:</p>
                <ul>
                    <li>Компактные лопастные долота</li>
                    <li>Облегченные шнековые буры</li>
                    <li>Специализированные долота малого диаметра</li>
                </ul>
                <h3>Долота для геологоразведочного бурения</h3>
                <p>Геологоразведка требует применения специализированного инструмента, обеспечивающего точное бурение и сохранение керна. В нашем каталоге представлены:</p>
                <ul>
                    <li>Колонковые долота различных диаметров</li>
                    <li>Алмазные коронки для отбора керна</li>
                    <li>Твердосплавные буровые коронки</li>
                </ul>
                <h2>Преимущества покупки буровых долот в ГК "Буровые технологии"</h2>
                <p>Как эксклюзивный дилер ведущих производителей бурового оборудования, мы обеспечиваем нашим клиентам ряд значимых преимуществ:</p>
                <ol>
                    <li><strong>Гарантированное качество</strong> – все долота и буровой инструмент проходят строгий контроль качества</li>
                    <li><strong>Оптимальная цена</strong> – прямые поставки от производителей без посредников</li>
                    <li><strong>Широкий ассортимент</strong> – в наличии более 500 наименований буровых долот и аксессуаров</li>
                    <li><strong>Техническая поддержка</strong> – консультации опытных специалистов по выбору инструмента</li>
                    <li><strong>Оперативная доставка</strong> – отправка товара по всей России в кратчайшие сроки</li>
                    <li><strong>Гарантийное обслуживание</strong> – поддержка на всех этапах эксплуатации инструмента</li>
                </ol>
                <h2>Часто задаваемые вопросы о буровых долотах</h2>
                <h3>Как определить необходимый диаметр долота?</h3>
                <p>Выбор диаметра долота зависит от нескольких факторов:</p>
                <ul>
                    <li>Конечный диаметр скважины</li>
                    <li>Технология бурения (с обсадной колонной или без)</li>
                    <li>Тип буровой установки</li>
                    <li>Геологические условия</li>
                </ul>
                <p>Для питьевых скважин на воду обычно используются долота диаметром от 100 до 250 мм, для технических скважин – от 75 до 150 мм.</p>
                <h3>Что влияет на срок службы бурового долота?</h3>
                <p>Долговечность бурового инструмента определяется:</p>
                <ul>
                    <li>Качеством материала и изготовления</li>
                    <li>Соответствием типа долота буримой породе</li>
                    <li>Правильностью режимов бурения (осевая нагрузка, обороты)</li>
                    <li>Эффективностью промывки</li>
                    <li>Регулярностью технического обслуживания</li>
                </ul>
                <h3>Можно ли восстановить изношенное долото?</h3>
                <p>Некоторые типы долот подлежат восстановлению:</p>
                <ul>
                    <li>Шарошечные долота могут подвергаться ремонту с заменой изношенных элементов</li>
                    <li>Лопастные долота иногда поддаются реставрации путем наплавки твердых сплавов</li>
                    <li>PDC и алмазные долота обычно не подлежат восстановлению из-за особенностей конструкции</li>
                </ul>
                <h2>Рекомендации по эксплуатации буровых долот</h2>
                <p>Для максимальной эффективности и продления срока службы бурового инструмента рекомендуется:</p>
                <ol>
                    <li>Соблюдать рекомендованные режимы бурения (осевая нагрузка, частота вращения)</li>
                    <li>Обеспечивать достаточную промывку для удаления шлама и охлаждения инструмента</li>
                    <li>Регулярно проверять состояние долота на предмет износа и повреждений</li>
                    <li>При смене типа породы своевременно менять долото на соответствующий тип</li>
                    <li>Хранить долота в сухом месте, защищенном от коррозии и механических повреждений</li>
                </ol>
                <h2>Заключение: как купить долото для бурения скважин</h2>
                <p>В каталоге ГК "Буровые технологии" вы найдете широкий ассортимент буровых долот для решения любых задач. Наши специалисты помогут подобрать оптимальный инструмент с учетом ваших конкретных условий и требований.</p>
                <p>
                    Чтобы купить долото для бурения скважин на воду или для других целей, достаточно связаться с нами удобным способом – по телефону, через форму на сайте или посетив наш офис. Мы работаем с клиентами по всей России,
                    обеспечивая оперативную доставку и полную техническую поддержку.
                </p>
                <p>
                    <strong>Не компрометируйте качество буровых работ – выбирайте профессиональный инструмент от надежного поставщика!</strong> Свяжитесь с нами прямо сейчас, чтобы получить подробную консультацию и выгодное предложение на
                    буровые долота от ведущих производителей.
                </p>
            </div>
        </section>

    </div>
</main>

</template>

