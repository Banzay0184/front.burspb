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

// Функция для создания HTML файла подборки
function createSelectionHTML(title, slug, description, itemCount = 0) {
  const fullTitle = `${title}. Купить ${title.toLowerCase()} в магазине ГК Буровые технологии — Оборудование для бурения №1 в России`;
  const fullDescription = description || `Купить ${title.toLowerCase()} в магазине ГК Буровые технологии! 🔥Широкий выбор ${title.toLowerCase()}! ✅Гарантия производителя!🚚 Доставка! 🎁Всегда в наличии!`;

  return `<!DOCTYPE html>
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
    "name": "${escapeHtml(title)}",
    "description": "${escapeHtml(fullDescription)}",
    "url": "https://burspb.com/catalog/selection-${slug}",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": ${itemCount}
    }
  }
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>`;
}

// Основная функция
async function main() {
  console.log('🔍 Поиск всех подборок в API...');
  
  // Известные категории которые могут содержать подборки
  const categoriesToCheck = [
    'pnevmoudarnik',
    'burovye-dolota', 
    'koronki-tverdosplavnye',
    'skvazhinnye-nasosy',
    'obsadnye-truby',
    'skvazhinnye-ogolovki'
  ];
  
  const foundSelections = [];
  
  // Ищем подборки в каждой категории
  for (const categorySlug of categoriesToCheck) {
    try {
      console.log(`📂 Проверяю категорию: ${categorySlug}`);
      const categoryData = await loadCategoryData(categorySlug);
      
      if (categoryData && categoryData.nested_categories) {
        console.log(`   Найдено ${categoryData.nested_categories.length} потенциальных подборок`);
        
        for (const nested of categoryData.nested_categories) {
          if (nested.slug && nested.title) {
            // Проверяем является ли это подборкой
            try {
              const selectionData = await loadCategoryData(nested.slug);
              
              if (selectionData && !selectionData.category && selectionData.posts && selectionData.posts.length > 0) {
                console.log(`   ✅ Найдена подборка: ${nested.title} (${selectionData.posts.length} товаров)`);
                foundSelections.push({
                  title: nested.title,
                  slug: nested.slug,
                  itemCount: selectionData.posts.length,
                  parentCategory: categorySlug
                });
              }
            } catch (error) {
              console.log(`   ⚠️ Ошибка проверки ${nested.slug}: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      console.log(`❌ Ошибка загрузки категории ${categorySlug}: ${error.message}`);
    }
  }
  
  console.log(`\n📦 Найдено ${foundSelections.length} подборок. Создаю HTML файлы...`);
  
  let createdCount = 0;
  const distDir = path.join(process.cwd(), 'dist');
  
  for (const selection of foundSelections) {
    try {
      const htmlContent = createSelectionHTML(selection.title, selection.slug, null, selection.itemCount);
      const fileName = `selection-${selection.slug}.html`;
      const filePath = path.join(distDir, fileName);
      
      fs.writeFileSync(filePath, htmlContent, 'utf8');
      console.log(`✅ Создан файл: ${fileName} - "${selection.title}" (${selection.itemCount} товаров)`);
      createdCount++;
    } catch (error) {
      console.log(`❌ Ошибка создания файла для ${selection.slug}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 Готово! Создано ${createdCount} HTML файлов подборок из ${foundSelections.length} найденных.`);
}

main().catch(console.error); 