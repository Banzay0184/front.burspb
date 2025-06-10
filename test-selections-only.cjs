const https = require('https');

async function retryApiCall(apiFunction, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiFunction();
      return result;
    } catch (error) {
      console.log(`⚠️ Ошибка API (попытка ${attempt}/${maxRetries}):`, error.message);
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

async function loadSubcategories() {
  return new Promise((resolve) => {
    const url = 'https://admin.burspb.com/data/v1/globals';
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.navigation && response.navigation.categories_full) {
            const subcategories = response.navigation.categories_full.filter(cat => cat.parent !== false);
            resolve(subcategories);
          } else {
            resolve([]);
          }
        } catch (error) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function loadCategoryData(slug) {
  return new Promise((resolve) => {
    const url = `https://admin.burspb.com/data/v1/category/slug/${slug}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function testSelections() {
  console.log('🔍 Тестирую логику поиска подборок...');
  
  const allSubcategories = await loadSubcategories();
  console.log(`📂 Найдено ${allSubcategories.length} подкатегорий`);
  
  const selections = [];
  let checked = 0;
  
  // Проверяем только первые 20 подкатегорий для теста
  const testSubcategories = allSubcategories.slice(0, 20);
  
  for (const subcategory of testSubcategories) {
    if (subcategory.slug && subcategory.title) {
      try {
        checked++;
        console.log(`📋 ${checked}. Проверяю: ${subcategory.title} (${subcategory.slug})`);
        
        const subcategoryData = await retryApiCall(() => loadCategoryData(subcategory.slug));
        
        if (subcategoryData) {
          const hasCategory = subcategoryData.category && subcategoryData.category !== null;
          const hasPosts = subcategoryData.posts && subcategoryData.posts.length > 0;
          
          console.log(`     Category: ${hasCategory ? 'есть' : 'НЕТ'}, Posts: ${subcategoryData.posts ? subcategoryData.posts.length : 0}`);
          
          if (!hasCategory && hasPosts) {
            console.log(`   ✅ НАЙДЕНА ПОДБОРКА: ${subcategory.title} (${subcategoryData.posts.length} товаров)`);
            selections.push({
              slug: subcategory.slug,
              title: subcategory.title,
              itemCount: subcategoryData.posts.length
            });
          }
        } else {
          console.log(`     ⚠️ Нет данных`);
        }
      } catch (error) {
        console.log(`     ❌ Ошибка: ${error.message}`);
      }
    }
  }
  
  console.log(`\n📦 ИТОГО: Найдено ${selections.length} подборок из ${checked} проверенных подкатегорий`);
  
  if (selections.length > 0) {
    console.log('\n🎯 Найденные подборки:');
    selections.forEach((sel, i) => {
      console.log(`${i + 1}. ${sel.title} (${sel.slug}) - ${sel.itemCount} товаров`);
    });
  }
}

testSelections(); 