const https = require('https');
const fs = require('fs');
const path = require('path');

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

// Функция для повторных попыток API вызовов
async function retryApiCall(apiCall, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`🔄 Повторная попытка ${attempt + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Функция для загрузки данных категории
async function loadCategoryData(slug) {
  return new Promise((resolve, reject) => {
    const url = `https://admin.burspb.com/data/v1/category/slug/${slug}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Функция для создания страницы подборки
function createSelectionPage(selectionData, slug, distDir, title) {
  // Используем переданный title или формируем из slug
  const selectionTitle = title || slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
  
  // Формируем SEO данные для подборки (как в рабочем коде)
  const fullTitle = `${selectionTitle}. Купить ${selectionTitle.toLowerCase()} в магазине ГК Буровые технологии — Оборудование для бурения №1 в России`;
  const fullDescription = `Купить ${selectionTitle.toLowerCase()} в магазине ГК Буровые технологии! 🔥Широкий выбор ${selectionTitle.toLowerCase()}! ✅Гарантия производителя!🚚 Доставка! 🎁Всегда в наличии!`;

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
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": ${selectionData.posts ? selectionData.posts.length : 0}
    }
  }
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>`;

  // Создаем файл в корне dist/ как в рабочем коде
  const fileName = `selection-${slug}.html`;
  const filePath = path.join(distDir, fileName);
  
  try {
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`✅ Создан файл: ${fileName} - "${selectionTitle}" (${selectionData.posts ? selectionData.posts.length : 0} товаров)`);
    return true;
  } catch (error) {
    console.error(`❌ Ошибка создания файла для подборки ${slug}:`, error.message);
    return false;
  }
}

// Функция для загрузки подборок
async function loadSelections() {
  const selections = [];
  
  console.log(`🔍 Поиск всех подборок в API через категории...`);
  
  // Категории которые могут содержать подборки (как в рабочем коде)
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
      
      if (categoryData && categoryData.nested_categories && categoryData.nested_categories.length > 0) {
        console.log(`   Найдено ${categoryData.nested_categories.length} потенциальных подборок`);
        
        // Проверяем каждую nested_category - является ли она подборкой
        for (const nested of categoryData.nested_categories) {
          if (nested.slug && nested.title) {
            try {
              // Загружаем данные nested_category
              const selectionData = await retryApiCall(() => loadCategoryData(nested.slug));
              
              if (selectionData) {
                // Подборка: НЕТ объекта category, но ЕСТЬ товары (точно как в рабочем коде)
                const hasCategory = selectionData.category;
                const hasPosts = selectionData.posts && selectionData.posts.length > 0;
                
                console.log(`     🔍 ${nested.title}: category=${hasCategory ? 'есть' : 'НЕТ'}, posts=${selectionData.posts ? selectionData.posts.length : 0}`);
                
                if (!hasCategory && hasPosts) {
                  console.log(`     ✅ Найдена подборка: ${nested.title} (${selectionData.posts.length} товаров)`);
                  selections.push({
                    slug: nested.slug,
                    title: nested.title,
                    parentCategory: categorySlug,
                    parentTitle: categoryData.title || categorySlug,
                    itemCount: selectionData.posts.length,
                    data: selectionData
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
}

// Основная функция
async function main() {
  console.log('🔧 Тестируем создание подборок...');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  // Загружаем подборки
  const selections = await loadSelections();
  
  if (selections.length === 0) {
    console.log('⚠️ API недоступен или не вернул подборки. Подборки не будут созданы.');
    return;
  }
  
  console.log(`📦 Создание ${selections.length} подборок...`);
  let createdSelections = 0;
  
  // Создаем страницы подборок
  for (const selection of selections) {
    try {
      console.log(`📦 Создаю страницу подборки: ${selection.title} (${selection.itemCount} товаров)`);
      
      // Создаем страницу подборки используя уже загруженные данные
      const created = createSelectionPage(selection.data, selection.slug, distDir, selection.title);
      if (created) {
        createdSelections++;
      }
    } catch (error) {
      console.error(`❌ Ошибка создания подборки ${selection.slug}:`, error.message);
    }
  }
  
  console.log(`🎉 Создано ${createdSelections} подборок из ${selections.length} найденных`);
}

main().catch(console.error); 