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

// Тестируем только первые несколько товаров из одной категории
async function loadProducts() {
  try {
    console.log(`🔍 Загружаю товары из одной тестовой категории...`);
    
    const url = 'https://admin.burspb.com/data/v1/category/slug/pnevmoudarnik';
    const categoryData = await new Promise((resolve, reject) => {
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
    
    if (categoryData && categoryData.posts && categoryData.posts.length > 0) {
      console.log(`   ✅ Найдено ${categoryData.posts.length} товаров в категории pnevmoudarnik`);
      return categoryData.posts;
    } else {
      console.log(`⚠️ Товары не найдены в категории pnevmoudarnik`);
      return [];
    }
    
  } catch (error) {
    console.log(`⚠️ Ошибка загрузки товаров: ${error.message}`);
    return [];
  }
}

// Функция для создания страницы товара  
function createProductPage(product, distDir) {
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
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
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
  console.log('🔧 Тестируем создание товаров...');
  
  const distDir = path.join(process.cwd(), 'dist');
  let createdProducts = 0;
  
  try {
    const allProducts = await loadProducts();
    
    if (allProducts && allProducts.length > 0) {
      console.log(`🛍️ Найдено ${allProducts.length} товаров в API. Создаю первые 5 для теста...`);
      
      // Создаем первые 5 товаров для теста
      for (const product of allProducts.slice(0, 5)) {
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
      
      console.log(`🎉 Создано ${createdProducts} страниц товаров из 5 тестовых`);
    } else {
      console.log(`⚠️ Товары не найдены в API`);
    }
  } catch (error) {
    console.log(`⚠️ Ошибка загрузки товаров: ${error.message}`);
  }
}

main().catch(console.error); 