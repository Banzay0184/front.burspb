import fs from 'fs';
import path from 'path';
import https from 'https';

// Функция для безопасного экранирования HTML символов
function escapeHtml(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Функция для повторных попыток при ошибках API
async function retryApiCall(apiFunction, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiFunction();
      return result;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`⚠️ Ошибка API (попытка ${attempt}/${maxRetries}): ${error.message}`);
      // Задержка между попытками
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
}

// Мета-теги для каждой страницы
const pageMetas = {
  '/': {
    title: 'Главная — Оборудование для бурения №1 в России',
    description: 'Профессиональное буровое оборудование - установки, долота, трубы, инструмент. Каталог, цены, доставка по России.'
  },
  '/catalog': {
    title: 'Каталог — Оборудование для бурения №1 в России',
    description: 'Каталог бурового оборудования и инструментов. Широкий ассортимент, гарантия качества, доставка по всей России.'
  },
  '/statji': {
    title: 'Статьи — Оборудование для бурения №1 в России',
    description: 'Полезные статьи и материалы об оборудовании для бурения скважин, технологиях и лучших практиках в отрасли.'
  },
  '/garantiya': {
    title: 'Гарантия — ГК Буровые технологии',
    description: 'Гарантийные обязательства и условия на буровое оборудование. Полная гарантия качества от ГК Буровые технологии.'
  },
  '/oplata': {
    title: 'Оплата — Оборудование для бурения №1 в России',
    description: 'Способы оплаты и условия покупки бурового оборудования. Удобные варианты оплаты и безопасные транзакции.'
  },
  '/dostavka': {
    title: 'Доставка — ГК Буровые технологии',
    description: 'Информация о доставке бурового оборудования по всей России. Быстрая и надежная доставка от ГК Буровые технологии.'
  },
  '/o-kompanii': {
    title: 'О компании — ГК Буровые технологии',
    description: 'Информация о компании ГК Буровые технологии - ведущем поставщике бурового оборудования в России.'
  },
  '/kontakty': {
    title: 'Контакты — ГК Буровые технологии',
    description: 'Контактная информация и способы связи с ГК Буровые технологии. Телефоны, адреса и электронная почта для связи.'
  },
  '/basket': {
    title: 'Корзина — Оборудование для бурения №1 в России',
    description: 'Ваша корзина покупок бурового оборудования. Оформление заказа и расчет стоимости доставки.'
  },
  '/search': {
    title: 'Поиск — Оборудование для бурения №1 в России',
    description: 'Поиск по каталогу бурового оборудования и инструментов. Найдите нужное оборудование быстро и просто.'
  },
  '/policy': {
    title: 'Политика конфиденциальности — ГК Буровые технологии',
    description: 'Политика конфиденциальности ГК Буровые технологии. Правила обработки персональных данных.'
  },
  '/terms': {
    title: 'Условия использования — ГК Буровые технологии',
    description: 'Пользовательское соглашение burspb.com. Условия использования интернет-магазина.'
  },
  '/cookie-policy': {
    title: 'Политика использования Cookie — ГК Буровые технологии',
    description: 'Политика использования файлов cookie на сайте ГК Буровые технологии.'
  },
  // Дополнительные страницы
  '/basket/confirm': {
    title: 'Подтверждение заказа — Оборудование для бурения №1 в России',
    description: 'Подтверждение вашего заказа бурового оборудования. Спасибо за покупку!'
  },
  '/seo-dashboard': {
    title: 'SEO Панель — Burspb Admin',
    description: 'Административная панель для управления SEO настройками сайта.'
  },
  '/seo-report': {
    title: 'SEO Отчет — Burspb Admin',
    description: 'Детальный отчет по SEO метрикам и показателям сайта.'
  }
};

// Функция для получения пути по имени файла
function getRouteFromFilename(filename, subdir = '') {
  if (filename === 'index.html' && !subdir) return '/';
  
  const route = subdir ? `/${subdir}/${filename.replace('.html', '')}` : `/${filename.replace('.html', '')}`;
  return route;
}

// Функция для рекурсивного поиска HTML файлов
function findHtmlFiles(dir, subdir = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Рекурсивно обрабатываем подпапки
      const subdirPath = subdir ? `${subdir}/${item}` : item;
      files.push(...findHtmlFiles(fullPath, subdirPath));
    } else if (item.endsWith('.html')) {
      files.push({
        filename: item,
        fullPath: fullPath,
        subdir: subdir
      });
    }
  }
  
  return files;
}

// Функция для обновления мета-тегов в HTML файле
function updateMetaTags(filePath, route) {
  console.log(`📄 Обрабатываю: ${filePath} (роут: ${route})`);
  
  const meta = pageMetas[route];
  if (!meta) {
    console.log(`⚠️ Мета-теги для ${route} не найдены`);
    return;
  }
  
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Заменяем title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${meta.title}</title>`
  );
  
  // Заменяем description
  html = html.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="${meta.description}">`
  );
  
  // Исправляем canonical URL для пагинации
  let canonicalUrl;
  if (route === '/') {
    canonicalUrl = 'https://burspb.com/';
  } else if (route.includes('/page/')) {
    // Для страниц пагинации убираем /page/X и указываем на базовую страницу
    canonicalUrl = `https://burspb.com${route.replace(/\/page\/\d+$/, '')}`;
  } else {
    canonicalUrl = `https://burspb.com${route}`;
  }
  
  // Обновляем canonical URL
  html = html.replace(
    /<link rel="canonical" href=".*?">/,
    `<link rel="canonical" href="${canonicalUrl}">`
  );
  
  // Если не найден canonical, добавляем
  if (!html.includes('<link rel="canonical"')) {
    html = html.replace(
      '<!-- Canonical URL (обновляется динамически для каждой страницы через JavaScript) -->',
      `<link rel="canonical" href="${canonicalUrl}">`
    );
  }
  
  fs.writeFileSync(filePath, html);
  console.log(`✅ Обновлен ${route}: "${meta.title}"`);
}

// Функция для загрузки статей из API
async function loadArticles() {
  return new Promise((resolve) => {
    https.get('https://admin.burspb.com/data/v1/posts', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          // API может возвращать данные в разных форматах
          if (Array.isArray(response)) {
            console.log(`📚 Загружено ${response.length} статей из API`);
            resolve(response);
          } else if (response.posts && Array.isArray(response.posts)) {
            console.log(`📚 Загружено ${response.posts.length} статей из API`);
            resolve(response.posts);
          } else if (response.data && Array.isArray(response.data)) {
            console.log(`📚 Загружено ${response.data.length} статей из API`);
            resolve(response.data);
          } else {
            console.log('⚠️ Не удалось загрузить статьи из API - неправильный формат ответа:', JSON.stringify(response).substring(0, 200));
            resolve([]);
          }
        } catch (error) {
          console.log('⚠️ Ошибка парсинга ответа API статей:', error.message);
          console.log('⚠️ Полученные данные:', data.substring(0, 200));
          resolve([]);
        }
      });
    }).on('error', (error) => {
      console.log('⚠️ Ошибка загрузки статей:', error.message);
      resolve([]);
    });
  });
}

// Функция для загрузки отдельной статьи из API
async function loadArticle(slug) {
  return new Promise((resolve) => {
    const url = `https://admin.burspb.com/data/v1/post/slug/${slug}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          // Для API endpoint /post/slug/{slug} ответ приходит напрямую как объект статьи
          if (response && response.title) {
            console.log(`📖 Загружена статья: ${response.title}`);
            resolve(response);
          } else {
            console.log(`⚠️ Статья ${slug} не найдена в API`);
            resolve(null);
          }
        } catch (error) {
          console.log(`⚠️ Ошибка парсинга ответа API для ${slug}:`, error.message);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.log(`⚠️ Ошибка загрузки статьи ${slug}:`, error.message);
      resolve(null);
    });
  });
}

// Функция создания HTML файла для статьи
async function createArticlePage(article, slug, distDir) {
  const DEFAULT_SUFFIX = 'Оборудование для бурения №1 в России';
  
  // Загружаем шаблон из существующей страницы статей
  const templatePath = path.join(distDir, 'statji.html');
  if (!fs.existsSync(templatePath)) {
    console.log('⚠️ Шаблон statji.html не найден');
    return;
  }
  
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  // Создаем title и description для статьи
  const title = `${article.title} — ${DEFAULT_SUFFIX}`;
  const cleanContent = article.content ? article.content.replace(/<[^>]*>/g, '') : '';
  const description = cleanContent.length > 150 
    ? `${cleanContent.slice(0, 150)}...` 
    : `Статья: ${article.title}. Полезная информация об оборудовании для бурения скважин.`;
  
  // Заменяем мета-теги
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );
  
  html = html.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="${description}">`
  );
  
  // Обновляем canonical URL
  const canonicalUrl = `https://burspb.com/statji/${slug}`;
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(
      /<link rel="canonical" href=".*?">/,
      `<link rel="canonical" href="${canonicalUrl}">`
    );
  } else {
    // Добавляем canonical URL после мета-тега author
    html = html.replace(
      /(<meta name="author".*?>)/,
      `$1\n    <link rel="canonical" href="${canonicalUrl}">`
    );
  }
  
  // Добавляем Open Graph meta tags для статьи
  const ogTitle = title;
  const ogDescription = description;
  const ogImage = article.img?.webp_full || article.img?.full || 'https://burspb.com/api/files/og-image-article.jpg';
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `https://burspb.com${ogImage}`;
  
  // Вставляем OG теги после основных мета-тегов
  const ogTags = `
    <meta property="og:type" content="article">
    <meta property="og:title" content="${ogTitle}">
    <meta property="og:description" content="${ogDescription}">
    <meta property="og:image" content="${fullOgImage}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="article:published_time" content="${article.date}">
    <meta property="article:modified_time" content="${article.modified}">
    <meta property="article:author" content="${article.author}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${ogTitle}">
    <meta name="twitter:description" content="${ogDescription}">
    <meta name="twitter:image" content="${fullOgImage}">`;
  
  // Вставляем OG теги после тега keywords
  html = html.replace(
    /(<meta name="keywords".*?>)/,
    `$1${ogTags}`
  );
  
  // Создаем папку для статей если не существует
  const statjiDir = path.join(distDir, 'statji');
  if (!fs.existsSync(statjiDir)) {
    fs.mkdirSync(statjiDir, { recursive: true });
  }
  
  // Сохраняем файл
  const articlePath = path.join(statjiDir, `${slug}.html`);
  fs.writeFileSync(articlePath, html);
  
  console.log(`✅ Создана страница статьи: /statji/${slug} - "${title}"`);
}

// Вспомогательная функция получения пути роута из файла
function getRouteFromPath(filePath, distDir) {
  const relativePath = path.relative(distDir, filePath);
  let route = '/' + relativePath.replace(/\.html$/, '').replace(/\\/g, '/');
  
  // Нормализуем роуты
  if (route === '/index') {
    route = '/';
  }
  
  return route;
}

// Функция получения всех HTML файлов рекурсивно
function getAllHtmlFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Рекурсивно обходим подпапки
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

// Функция для загрузки категорий каталога из API
async function loadCategories() {
  return new Promise((resolve) => {
    const url = 'https://admin.burspb.com/data/v1/globals';
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          // Получаем только главные категории (parent: false)
          if (response.navigation && response.navigation.categories_full) {
            const mainCategories = response.navigation.categories_full.filter(cat => cat.parent === false);
            console.log(`📂 Найдено ${mainCategories.length} главных категорий каталога`);
            resolve(mainCategories);
          } else if (response.categories && Array.isArray(response.categories)) {
            const mainCategories = response.categories.filter(cat => !cat.parent || cat.parent === false);
            console.log(`📂 Найдено ${mainCategories.length} главных категорий каталога`);
            resolve(mainCategories);
          } else {
            console.log('⚠️ Категории каталога не найдены в API:', JSON.stringify(response).substring(0, 200));
            resolve([]);
          }
        } catch (error) {
          console.log('⚠️ Ошибка парсинга ответа API для категорий:', error.message);
          console.log('⚠️ Полученные данные:', data.substring(0, 200));
          resolve([]);
        }
      });
    }).on('error', (error) => {
      console.log('⚠️ Ошибка загрузки категорий:', error.message);
      resolve([]);
    });
  });
}

// Функция для загрузки отдельной категории с полными SEO данными и повторными попытками
async function loadCategoryData(slug, retries = 3) {
  return new Promise((resolve) => {
    const attemptLoad = (attempt) => {
              const url = `https://admin.burspb.com/data/v1/category/slug/${slug}`;
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            // API endpoint category/slug/{slug} возвращает данные напрямую
            if (response && response.category) {
              console.log(`📖 Загружена категория: ${response.category.title}`);
              resolve(response);
            } else if (response && response.posts && response.posts.length > 0) {
              // Если категории нет, но есть товары - создаем базовую структуру
              console.log(`📖 Найдены товары для категории ${slug}, создаю базовую страницу`);
              const basicCategory = {
                category: {
                  id: null,
                  title: slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
                  seo: {
                    head_title: slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
                    head_description: `Купить ${slug.replace(/-/g, ' ')} в интернет-магазине. Широкий ассортимент бурового оборудования, доставка по России, гарантия качества.`
                  }
                },
                posts: response.posts,
                breadcrumbs: response.breadcrumbs || []
              };
              resolve(basicCategory);
            } else {
              console.log(`⚠️ Категория ${slug} не найдена в API`);
              resolve(null);
            }
          } catch (error) {
            console.log(`⚠️ Ошибка парсинга ответа API для категории ${slug}:`, error.message);
            if (attempt < retries) {
              console.log(`🔄 Повторная попытка ${attempt + 1}/${retries} для категории ${slug}`);
              setTimeout(() => attemptLoad(attempt + 1), 1000 * attempt); // Увеличиваем задержку с каждой попыткой
            } else {
              resolve(null);
            }
          }
        });
      }).on('error', (error) => {
        console.log(`⚠️ Ошибка загрузки категории ${slug} (попытка ${attempt}/${retries}):`, error.message);
        if (attempt < retries) {
          console.log(`🔄 Повторная попытка ${attempt + 1}/${retries} для категории ${slug}`);
          setTimeout(() => attemptLoad(attempt + 1), 1000 * attempt); // Увеличиваем задержку с каждой попыткой
        } else {
          console.log(`❌ Не удалось загрузить категорию ${slug} после ${retries} попыток`);
          resolve(null);
        }
      });
    };
    
    attemptLoad(1);
  });
}

// Функция создания HTML файла для категории каталога
async function createCategoryPage(categoryData, slug, distDir) {
  const DEFAULT_SUFFIX = 'Оборудование для бурения №1 в России';
  
  // Загружаем шаблон из существующей страницы каталога
  const templatePath = path.join(distDir, 'catalog.html');
  if (!fs.existsSync(templatePath)) {
    console.log('⚠️ Шаблон catalog.html не найден');
    return;
  }
  
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  // Создаем title и description для категории
  const seoData = categoryData.category?.seo;
  let title = '';
  
  if (seoData?.head_title) {
    // Если есть head_title, проверяем есть ли уже суффикс
    title = seoData.head_title;
    if (title && typeof title === 'string' && !title.includes(DEFAULT_SUFFIX)) {
      title = `${title} — ${DEFAULT_SUFFIX}`;
    }
  } else if (seoData?.title) {
    // Если есть просто title, добавляем суффикс
    title = `${seoData.title} — ${DEFAULT_SUFFIX}`;
  } else {
    // Если нет SEO данных, формируем из названия категории
    title = `${categoryData.category.title} — ${DEFAULT_SUFFIX}`;
  }
  
  const description = seoData?.head_description || 
    (seoData?.description ? seoData.description.replace(/<[^>]*>/g, '').slice(0, 160) : 
    `Купить ${categoryData.category.title.toLowerCase()} в интернет-магазине. Широкий ассортимент бурового оборудования, доставка по России, гарантия качества.`);
  
  // Определяем OG изображение - берем из первого товара или дефолтное
  const ogImage = categoryData.posts && categoryData.posts.length > 0 && categoryData.posts[0].img?.webp_full
    ? categoryData.posts[0].img.webp_full || categoryData.posts[0].img?.full
    : 'https://burspb.com/api/files/og-image-catalog.jpg';

  // Обновляем title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  
  // Обновляем description
  html = html.replace(/<meta name="description" content=".*?">/i, 
    `<meta name="description" content="${escapeHtml(description)}">`);
  
  // Обновляем Open Graph мета-теги
  html = html.replace(/<meta property="og:title" content=".*?">/i, 
    `<meta property="og:title" content="${escapeHtml(title)}">`);
  html = html.replace(/<meta property="og:description" content=".*?">/i, 
    `<meta property="og:description" content="${escapeHtml(description)}">`);
  html = html.replace(/<meta property="og:image" content=".*?">/i, 
    `<meta property="og:image" content="${ogImage}">`);
  
  // Обновляем Twitter мета-теги
  html = html.replace(/<meta name="twitter:title" content=".*?">/i, 
    `<meta name="twitter:title" content="${escapeHtml(title)}">`);
  html = html.replace(/<meta name="twitter:description" content=".*?">/i, 
    `<meta name="twitter:description" content="${escapeHtml(description)}">`);
  html = html.replace(/<meta name="twitter:image" content=".*?">/i, 
    `<meta name="twitter:image" content="${ogImage}">`);

  // Создаем директорию и сохраняем файл
  const categoryDir = path.join(distDir, 'catalog');
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  const filePath = path.join(categoryDir, `category-${slug}.html`);
  fs.writeFileSync(filePath, html);
  return true;
}

// Функция для загрузки всех подкатегорий из API
async function loadSubcategories() {
  return new Promise((resolve) => {
    const url = 'https://admin.burspb.com/data/v1/globals';
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          // Получаем все подкатегории (parent: не false)
          if (response.navigation && response.navigation.categories_full) {
            const subcategories = response.navigation.categories_full.filter(cat => cat.parent !== false);
            console.log(`📂 Найдено ${subcategories.length} подкатегорий каталога`);
            resolve(subcategories);
          } else if (response.categories && Array.isArray(response.categories)) {
            const subcategories = response.categories.filter(cat => cat.parent && cat.parent !== false);
            console.log(`📂 Найдено ${subcategories.length} подкатегорий каталога`);
            resolve(subcategories);
          } else {
            console.log('⚠️ Подкатегории каталога не найдены в API:', JSON.stringify(response).substring(0, 200));
            resolve([]);
          }
        } catch (error) {
          console.log('⚠️ Ошибка парсинга ответа API для подкатегорий:', error.message);
          console.log('⚠️ Полученные данные:', data.substring(0, 200));
          resolve([]);
        }
      });
    }).on('error', (error) => {
      console.log('⚠️ Ошибка загрузки подкатегорий:', error.message);
      resolve([]);
    });
  });
}

// Функция для получения актуальных имен ассетов
function getAssetNames(distDir) {
  const assetsDir = path.join(distDir, 'assets');
  const files = fs.readdirSync(assetsDir);
  
  const appJs = files.find(f => f.startsWith('app-') && f.endsWith('.js'));
  const appCss = files.find(f => f.startsWith('app-') && f.endsWith('.css'));
  const vueVendorJs = files.find(f => f.startsWith('vue-vendor-') && f.endsWith('.js'));
  const utilsJs = files.find(f => f.startsWith('utils-') && f.endsWith('.js'));
  
  return {
    appJs: appJs || 'app.js',
    appCss: appCss || 'app.css', 
    vueVendorJs: vueVendorJs || 'vue-vendor.js',
    utilsJs: utilsJs || 'utils.js'
  };
}

// Функция для создания страницы подборки
function createSelectionPage(selectionData, slug, distDir, title, parentCategory, parentTitle) {
  // Получаем актуальные имена ассетов
  const assets = getAssetNames(distDir);
  
  // Используем переданный title или формируем из slug
  const selectionTitle = title || slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
  
  // Формируем SEO данные для подборки (как в рабочем коде)
  const fullTitle = `${selectionTitle}. Купить ${selectionTitle.toLowerCase()} в магазине ГК Буровые технологии — Оборудование для бурения №1 в России`;
  const fullDescription = `Купить ${selectionTitle.toLowerCase()} в магазине ГК Буровые технологии! 🔥Широкий выбор ${selectionTitle.toLowerCase()}! ✅Гарантия производителя!🚚 Доставка! 🎁Всегда в наличии!`;
  
  // Строим правильные breadcrumbs для подборки
  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' }
  ];
  
  // Добавляем иерархию категорий для подборок
  if (parentCategory === 'pnevmoudarnik') {
    breadcrumbs.push(
      { name: 'Инструмент для пневмоударного бурения', url: '/catalog/category-instrumenty-dlya-pnevmoudarnogo-bureniya' },
      { name: 'Пневмоударники', url: '/catalog/category-pnevmoudarnik' }
    );
  } else if (parentCategory === 'burovye-dolota') {
    breadcrumbs.push(
      { name: 'Буровой инструмент', url: '/catalog/category-burovoj-instrument' },
      { name: 'Буровые долота', url: '/catalog/category-burovye-dolota' }
    );
  } else if (parentCategory === 'koronki-tverdosplavnye') {
    breadcrumbs.push(
      { name: 'Буровой инструмент', url: '/catalog/category-burovoj-instrument' },
      { name: 'Коронки твердосплавные', url: '/catalog/category-koronki-tverdosplavnye' }
    );
  } else if (parentCategory === 'skvazhinnye-nasosy') {
    breadcrumbs.push(
      { name: 'Насосное оборудование', url: '/catalog/category-nasosnoe-oborudovanie' },
      { name: 'Скважинные насосы', url: '/catalog/category-skvazhinnye-nasosy' }
    );
  } else if (parentCategory === 'obsadnye-truby') {
    breadcrumbs.push(
      { name: 'Обсадные материалы', url: '/catalog/category-obsadnye-materialy' },
      { name: 'Обсадные трубы', url: '/catalog/category-obsadnye-truby' }
    );
  } else if (parentCategory === 'skvazhinnye-ogolovki') {
    breadcrumbs.push(
      { name: 'Скважинное оборудование', url: '/catalog/category-skvazhinnoe-oborudovanie' },
      { name: 'Скважинные оголовки', url: '/catalog/category-skvazhinnye-ogolovki' }
    );
  } else {
    // Общий случай
    breadcrumbs.push({ name: parentTitle || parentCategory, url: `/catalog/category-${parentCategory}` });
  }
  
  // Добавляем текущую подборку
  breadcrumbs.push({ name: selectionTitle, url: `/catalog/selection-${slug}` });

  const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(fullDescription)}">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(fullDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://burspb.com/catalog/selection-${slug}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(fullDescription)}">
  <link rel="canonical" href="https://burspb.com/catalog/selection-${slug}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${escapeHtml(selectionTitle)}",
    "description": "${escapeHtml(fullDescription)}",
    "url": "https://burspb.com/catalog/selection-${slug}",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        ${breadcrumbs.map((crumb, index) => `{
          "@type": "ListItem",
          "position": ${index + 1},
          "name": "${escapeHtml(crumb.name)}",
          "item": "https://burspb.com${crumb.url}"
        }`).join(',')}
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": ${selectionData.posts ? selectionData.posts.length : 0}
    }
  }
  </script>
</head>
<body>
  <div id="app" data-server-rendered="true">
    <!-- SSR данные подборки -->
    <script type="application/json" id="__INITIAL_STATE__">
    ${JSON.stringify({
      selection: {
        slug: slug,
        title: selectionTitle,
        description: fullDescription,
        breadcrumbs: breadcrumbs,
        posts: (selectionData.posts || []).map(post => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          date: post.date,
          modified: post.modified,
          price: post.price,
          img: post.img ? {
            webp_small: post.img.webp_small,
            webp_medium: post.img.webp_medium,
            webp_full: post.img.webp_full,
            small: post.img.small,
            medium: post.img.medium,
            full: post.img.full
          } : null,
          category: post.category,
          availability: post.availability
        })),
        parentCategory: parentCategory
      }
    }).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')}
    </script>
  </div>
  <script type="module" crossorigin="" src="/assets/${assets.appJs}"></script>
  <link rel="modulepreload" crossorigin="" href="/assets/${assets.vueVendorJs}">
  <link rel="modulepreload" crossorigin="" href="/assets/${assets.utilsJs}">
  <link rel="stylesheet" crossorigin="" href="/assets/${assets.appCss}">
</body>
</html>`;

  // Создаем файл в папке catalog/ 
  const catalogDir = path.join(distDir, 'catalog');
  if (!fs.existsSync(catalogDir)) {
    fs.mkdirSync(catalogDir, { recursive: true });
  }
  const fileName = `selection-${slug}.html`;
  const filePath = path.join(catalogDir, fileName);
  
  try {
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`✅ Создан файл: /catalog/${fileName} - "${selectionTitle}" (${selectionData.posts ? selectionData.posts.length : 0} товаров)`);
    return true;
  } catch (error) {
    console.error(`❌ Ошибка создания файла для подборки ${slug}:`, error.message);
    return false;
  }
}

// Функция для загрузки всех подборок напрямую из API
async function loadSelections() {
  const selections = [];
  
  console.log(`🔍 Загрузка подборок из API...`);
  
  try {
    // Загружаем подборки через категории (endpoint /v1/selections не существует)
    console.log('🔄 Загружаю подборки через категории...');
      
      const categoriesToCheck = [
        'pnevmoudarnik',
        'burovye-dolota', 
        'koronki-tverdosplavnye',
        'skvazhinnye-nasosy',
        'obsadnye-truby',
        'skvazhinnye-ogolovki'
      ];
      
      console.log(`📂 Проверяю ${categoriesToCheck.length} категорий на наличие подборок...`);
      
      // Проверяем каждую категорию на наличие nested_categories (подборок)
      for (const categorySlug of categoriesToCheck) {
        try {
          console.log(`📂 Проверяю категорию: ${categorySlug}`);
          
          // Загружаем полные данные категории чтобы получить nested_categories
          const categoryData = await retryApiCall(() => loadCategoryData(categorySlug));
          console.log(`   Данные категории ${categorySlug}: ${categoryData ? 'загружены' : 'НЕ НАЙДЕНЫ'}`);
          
          if (categoryData && categoryData.nested_categories && categoryData.nested_categories.length > 0) {
            console.log(`   Найдено ${categoryData.nested_categories.length} потенциальных подборок`);
            
            // Проверяем каждую nested_category - является ли она подборкой
            for (const nested of categoryData.nested_categories) {
              if (nested.slug && nested.title) {
                try {
                  // Загружаем данные nested_category
                  const selectionData = await retryApiCall(() => loadCategoryData(nested.slug));
                  
                  if (selectionData) {
                    // Подборка: элемент из nested_categories с товарами
                    const hasCategory = selectionData.category;
                    const hasPosts = selectionData.posts && selectionData.posts.length > 0;
                    
                    console.log(`     🔍 ${nested.title}: category=${hasCategory ? 'есть' : 'НЕТ'}, posts=${selectionData.posts ? selectionData.posts.length : 0}`);
                    
                    // Изменяем логику: подборки это nested_categories с товарами
                    if (hasPosts) {
                      // Фильтруем товары по релевантности к подборке
                      let filteredPosts = selectionData.posts;
                      
                      // Для пневмоударников фильтруем по размеру в названии
                      if (nested.slug.includes('pnevmoudarniki-') && nested.slug.includes('-mm')) {
                        const sizeMatch = nested.slug.match(/(\d+)-mm/);
                        if (sizeMatch) {
                          const targetSize = sizeMatch[1];
                          filteredPosts = selectionData.posts.filter(post => 
                            post.title && (post.title.includes(targetSize) || post.title.toLowerCase().includes('пневмоударник'))
                          );
                        }
                      }
                      // Для других подборок можно добавить аналогичную логику
                      
                      console.log(`     ✅ Найдена подборка: ${nested.title} (${selectionData.posts.length} товаров, ${filteredPosts.length} отфильтровано)`);
                      
                      // Создаем данные с отфильтрованными товарами
                      const filteredData = {
                        ...selectionData,
                        posts: filteredPosts
                      };
                      
                      selections.push({
                        slug: nested.slug,
                        title: nested.title,
                        parentCategory: categorySlug,
                        parentTitle: categoryData.title || categorySlug,
                        itemCount: filteredPosts.length,
                        data: filteredData
                      });
                    }
                  }
                } catch (error) {
                  console.log(`     ⚠️ Ошибка проверки ${nested.slug}: ${error.message}`);
                }
              }
            }
          }
        } catch (error) {
          console.log(`⚠️ Ошибка загрузки данных категории ${categorySlug}: ${error.message}`);
        }
      }
    
    console.log(`📦 Найдено ${selections.length} подборок в базе данных`);
    return selections;
    
  } catch (error) {
    console.log(`❌ Критическая ошибка загрузки подборок: ${error.message}`);
    console.log(`   Stack trace: ${error.stack}`);
    return [];
  }
}

// Функция для загрузки всех товаров напрямую из API с поддержкой пагинации
async function loadProducts() {
  const allProducts = [];
  let currentPage = 1;
  let totalPages = 1;
  
  console.log(`🔍 Загружаю товары из API с пагинацией...`);
  
  try {
    do {
      console.log(`📄 Загружаю страницу ${currentPage}/${totalPages}...`);
      
      const pageProducts = await new Promise((resolve) => {
        const url = `https://admin.burspb.com/data/v1/products?page=${currentPage}`;
        https.get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              
              // Получаем информацию о пагинации
              if (response.pagination && response.pagination.pages_total) {
                totalPages = response.pagination.pages_total;
              }
              
              // API может возвращать данные в разных форматах
              if (Array.isArray(response)) {
                console.log(`   📦 Получено ${response.length} товаров со страницы ${currentPage}`);
                resolve(response);
              } else if (response.posts && Array.isArray(response.posts)) {
                console.log(`   📦 Получено ${response.posts.length} товаров со страницы ${currentPage}`);
                resolve(response.posts);
              } else if (response.products && Array.isArray(response.products)) {
                console.log(`   📦 Получено ${response.products.length} товаров со страницы ${currentPage}`);
                resolve(response.products);
              } else if (response.data && Array.isArray(response.data)) {
                console.log(`   📦 Получено ${response.data.length} товаров со страницы ${currentPage}`);
                resolve(response.data);
              } else {
                console.log(`⚠️ Страница ${currentPage}: неправильный формат ответа`);
                resolve([]);
              }
            } catch (error) {
              console.log(`⚠️ Ошибка парсинга страницы ${currentPage}:`, error.message);
              resolve([]);
            }
          });
        }).on('error', (error) => {
          console.log(`⚠️ Ошибка загрузки страницы ${currentPage}:`, error.message);
          resolve([]);
        });
      });
      
      if (pageProducts.length > 0) {
        allProducts.push(...pageProducts);
      }
      
      currentPage++;
      
      // Небольшая задержка между запросами, чтобы не нагружать API
      if (currentPage <= totalPages) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } while (currentPage <= totalPages);
    
    // Убираем дубликаты товаров по slug
    const uniqueProducts = [];
    const seenSlugs = new Set();
    
    for (const product of allProducts) {
      if (product.slug && !seenSlugs.has(product.slug)) {
        seenSlugs.add(product.slug);
        uniqueProducts.push(product);
      }
    }
    
    console.log(`📦 Всего загружено товаров: ${allProducts.length}, уникальных: ${uniqueProducts.length}`);
    return uniqueProducts;
    
  } catch (error) {
    console.log('⚠️ Критическая ошибка загрузки товаров:', error.message);
    return [];
  }
}

// Функция для создания страницы товара  
function createProductPage(product, distDir) {
  // Получаем актуальные имена ассетов
  const assets = getAssetNames(distDir);
  
  const productTitle = product.title || 'Товар';
  
  // Формируем SEO данные для товара
  const fullTitle = `${productTitle} — Оборудование для бурения №1 в России`;
  
  // Используем краткое описание из content или формируем из title
  let description = '';
  if (product.content && typeof product.content === 'string') {
    // Берем первые 160 символов из content и очищаем от HTML
    description = product.content
      .replace(/<[^>]*>/g, '') // удаляем HTML теги
      .replace(/\r\n/g, ' ') // заменяем переносы строк на пробелы
      .substring(0, 160);
    if (product.content.length > 160) {
      description += '...';
    }
  }
  
  if (!description) {
    description = `Купить ${productTitle.toLowerCase()} в магазине ГК Буровые технологии! ✅Гарантия производителя!🚚 Доставка! 🎁Всегда в наличии!`;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="https://burspb.com/catalog/product-${product.slug}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="canonical" href="https://burspb.com/catalog/product-${product.slug}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${escapeHtml(productTitle)}",
    "description": "${escapeHtml(description)}",
    "url": "https://burspb.com/catalog/product-${product.slug}",
    "offers": {
      "@type": "Offer",
      "price": "${product.meta?.price || '0'}",
      "priceCurrency": "RUB",
      "availability": "${product.meta?.availability ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}"
    }
  }
  </script>
</head>
<body>
  <div id="app" data-server-rendered="true">
    <!-- SSR данные товара -->
    <script type="application/json" id="__INITIAL_STATE__">
    ${JSON.stringify({
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        content: typeof product.content === 'string' ? product.content.replace(/<[^>]*>/g, '') : product.content,
        price: product.meta?.price || product.price,
        availability: product.meta?.availability || product.availability,
        img: product.img ? {
          webp_small: product.img.webp_small,
          webp_medium: product.img.webp_medium,
          webp_full: product.img.webp_full,
          small: product.img.small,
          medium: product.img.medium,
          full: product.img.full
        } : null,
        category: typeof product.category === 'string' ? product.category : (product.category?.title || product.category?.name),
        breadcrumbs: product.breadcrumbs || []
      }
    }).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')}
          </script>
    </div>
        <script type="module" crossorigin="" src="/assets/${assets.appJs}"></script>
    <link rel="modulepreload" crossorigin="" href="/assets/${assets.vueVendorJs}">
    <link rel="modulepreload" crossorigin="" href="/assets/${assets.utilsJs}">
    <link rel="stylesheet" crossorigin="" href="/assets/${assets.appCss}">
</body>
</html>`;

  // Создаем папку catalog если её нет
  const catalogDir = path.join(distDir, 'catalog');
  if (!fs.existsSync(catalogDir)) {
    fs.mkdirSync(catalogDir, { recursive: true });
    console.log('📁 Создана папка /catalog');
  }
  
  // Создаем файл товара в папке catalog с префиксом product-
  const fileName = `product-${product.slug}.html`;
  const filePath = path.join(catalogDir, fileName);
  
  try {
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`✅ Создан файл: /catalog/${fileName} - "${productTitle}"`);
    return true;
  } catch (error) {
    console.error(`❌ Ошибка создания файла для товара ${product.slug}:`, error.message);
    return false;
  }
}

// Основная функция
async function main() {
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.log('❌ Папка сборки dist/ не найдена');
    process.exit(1);
  }
  
  console.log('🔧 Начинаю постобработку SEO мета-тегов...');
  
  // Сначала создаем страницы статей
  console.log('📚 Загрузка всех статей из API...');
  const articles = await loadArticles();
  
  let createdArticles = 0;
  
  if (articles && articles.length > 0) {
    console.log(`📝 Найдено ${articles.length} статей в API. Создаю страницы...`);
    
    // Создаем HTML файлы для всех статей из API
    for (const article of articles) {
      if (article.slug) {
        try {
          // Загружаем полные данные статьи
          const fullArticle = await loadArticle(article.slug);
          if (fullArticle) {
            await createArticlePage(fullArticle, article.slug, distDir);
            createdArticles++;
            console.log(`✅ Создана страница: /statji/${article.slug} - "${fullArticle.title}"`);
          } else {
            console.log(`⚠️ Не удалось загрузить полные данные для статьи: ${article.slug}`);
          }
        } catch (error) {
          console.log(`❌ Ошибка создания страницы для ${article.slug}:`, error.message);
        }
      }
    }
    
    console.log(`🎉 Создано ${createdArticles} страниц статей из ${articles.length} найденных`);
  } else {
    console.log('⚠️ API недоступен или не вернул статьи. Статьи не будут созданы.');
    createdArticles = 0;
  }

  // Затем создаем страницы категорий каталога
  console.log('📂 Загрузка категорий каталога из API...');
  const categories = await loadCategories();

  let createdCategories = 0;

  if (categories && categories.length > 0) {
    console.log(`🏷️ Найдено ${categories.length} категорий каталога в API. Создаю страницы...`);
    
    // Создаем HTML файлы для всех категорий из API
    for (const category of categories) {
      if (category.slug) {
        try {
          // Загружаем полные данные категории
          const fullCategoryData = await loadCategoryData(category.slug);
          if (fullCategoryData) {
            await createCategoryPage(fullCategoryData, category.slug, distDir);
            createdCategories++;
            console.log(`✅ Создана страница: /catalog/category-${category.slug} - "${fullCategoryData.category.title}"`);
          } else {
            console.log(`⚠️ Не удалось загрузить полные данные для категории: ${category.slug}`);
          }
        } catch (error) {
          console.log(`❌ Ошибка создания страницы для категории ${category.slug}:`, error.message);
        }
      }
    }
    
    console.log(`🎉 Создано ${createdCategories} страниц категорий из ${categories.length} найденных`);
  } else {
    console.log('⚠️ API недоступен или не вернул категории. Категории не будут созданы.');
    createdCategories = 0;
  }

  // Затем создаем страницы подкатегорий каталога
  console.log('📂 Загрузка подкатегорий каталога из API...');
  const subcategories = await loadSubcategories();

  let createdSubcategories = 0;

  if (subcategories && subcategories.length > 0) {
    console.log(`🏷️ Найдено ${subcategories.length} подкатегорий каталога в API. Создаю страницы...`);
    
    // Создаем HTML файлы для всех подкатегорий из API
    for (const subcategory of subcategories) {
      if (subcategory.slug) {
        try {
          // Загружаем полные данные подкатегории
          const fullSubcategoryData = await retryApiCall(() => loadCategoryData(subcategory.slug));
          
          if (fullSubcategoryData && fullSubcategoryData.category) {
            // Обычная подкатегория с SEO данными
            const created = await createCategoryPage(fullSubcategoryData, subcategory.slug, distDir);
            if (created) {
              createdSubcategories++;
              console.log(`✅ Создана страница: /catalog/category-${subcategory.slug} - "${fullSubcategoryData.category.title}"`);
            }
          } else if (fullSubcategoryData && fullSubcategoryData.posts && fullSubcategoryData.posts.length > 0) {
            // Если категории нет, но есть товары - создаем базовую структуру
            console.log(`📖 Найдены товары для категории ${subcategory.slug}, создаю базовую страницу`);
            const basicCategory = {
              category: {
                id: null,
                title: subcategory.slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
                seo: {
                  head_title: `${subcategory.slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())} — Оборудование для бурения №1 в России`,
                  head_description: `Купить ${subcategory.slug.replace(/-/g, ' ').toLowerCase()} в интернет-магазине. Широкий ассортимент бурового оборудования, доставка по России, гарантия качества.`
                }
              },
              posts: fullSubcategoryData.posts
            };
            
            const created = await createCategoryPage(basicCategory, subcategory.slug, distDir);
            if (created) {
              createdSubcategories++;
              console.log(`✅ Создана страница: /catalog/category-${subcategory.slug} - "${basicCategory.category.title}"`);
            }
          } else {
            console.log(`⚠️ Подкатегория ${subcategory.slug} не найдена в API`);
          }
        } catch (error) {
          console.log(`⚠️ Не удалось загрузить полные данные для подкатегории: ${subcategory.slug}`);
        }
      }
    }
    
    console.log(`🎉 Создано ${createdSubcategories} страниц подкатегорий из ${subcategories.length} найденных`);
  } else {
    console.log('⚠️ API недоступен или не вернул подкатегории. Подкатегории не будут созданы.');
    createdSubcategories = 0;
  }

  // Затем создаем страницы подборок каталога
  console.log('📦 Загрузка подборок каталога из API...');
  const selections = await loadSelections();

  let createdSelections = 0;

  if (selections && selections.length > 0) {
    console.log(`🎯 Найдено ${selections.length} подборок каталога в API. Создаю страницы...`);
    
    // Создаем HTML файлы для всех подборок из API
    for (const selection of selections) {
      if (selection.slug && selection.data) {
        try {
          console.log(`📦 Создаю страницу подборки: ${selection.title} (${selection.itemCount} товаров)`);
          
          // Создаем страницу подборки используя уже загруженные данные
          const created = createSelectionPage(selection.data, selection.slug, distDir, selection.title, selection.parentCategory, selection.parentTitle);
          if (created) {
            createdSelections++;
          }
        } catch (error) {
          console.log(`⚠️ Ошибка создания страницы подборки ${selection.slug}: ${error.message}`);
        }
      }
    }
    
    console.log(`🎉 Создано ${createdSelections} страниц подборок из ${selections.length} найденных`);
  } else {
    console.log('⚠️ API недоступен или не вернул подборки. Подборки не будут созданы.');
    createdSelections = 0;
  }

  // Затем создаем страницы товаров
  console.log('📦 Загрузка товаров каталога из API...');
  let createdProducts = 0;
  
  try {
    const allProducts = await loadProducts();
    
    if (allProducts && allProducts.length > 0) {
      console.log(`🛍️ Найдено ${allProducts.length} товаров в API. Создаю страницы...`);
      
      // Создаем страницы товаров
      for (const product of allProducts) {
        if (product.slug && product.title) {
          try {
            console.log(`📦 Создаю страницу товара: ${product.title}`);
            
            const created = createProductPage(product, distDir);
            if (created) {
              createdProducts++;
            }
          } catch (error) {
            console.error(`❌ Ошибка создания товара ${product.slug}:`, error.message);
          }
        }
      }
      
      console.log(`🎉 Создано ${createdProducts} страниц товаров из ${allProducts.length} найденных`);
    } else {
      console.log(`⚠️ Товары не найдены в API`);
    }
  } catch (error) {
    console.log(`⚠️ Ошибка загрузки товаров: ${error.message}`);
  }

  // Затем обрабатываем остальные страницы
  console.log('📄 Обработка мета-тегов для основных страниц...');
  const htmlFiles = getAllHtmlFiles(distDir);
  
  for (const file of htmlFiles) {
    const route = getRouteFromPath(file, distDir);
    
    // Пропускаем созданные страницы статей
    if (route.startsWith('/statji/') && route !== '/statji') {
      continue;
    }
    
    // Пропускаем созданные страницы категорий каталога
    if (route.startsWith('/catalog/category-')) {
      continue;
    }
    
    // Пропускаем созданные страницы подборок
    if (route.startsWith('/catalog/selection-') || route.startsWith('/selection-')) {
      continue;
    }
    
    // Пропускаем созданные страницы товаров
    if (route.startsWith('/products/') || route.startsWith('/catalog/product-') || route.startsWith('/product-') || route.startsWith('/product/')) {
      continue;
    }
    
    const meta = pageMetas[route];
    if (meta) {
      updateMetaTags(file, route);
    }
  }
  
  console.log(`✅ Постобработка SEO завершена! Создано статей: ${createdArticles}, категорий: ${createdCategories}, подкатегорий: ${createdSubcategories}, подборок: ${createdSelections}, товаров: ${createdProducts}`);
}

main();