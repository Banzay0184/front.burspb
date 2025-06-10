const fs = require('fs');
const https = require('https');

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

async function testSelections() {
  console.log('🔍 Тестируем поиск подборок...');
  const categorySlug = 'pnevmoudarnik';
  
  try {
    const categoryData = await loadCategoryData(categorySlug);
    console.log(`📂 Категория ${categorySlug}: найдено ${categoryData.nested_categories?.length || 0} nested_categories`);
    
    if (categoryData.nested_categories) {
      for (const nested of categoryData.nested_categories.slice(0, 2)) {
        const selectionData = await loadCategoryData(nested.slug);
        const hasCategory = selectionData.category;
        const hasPosts = selectionData.posts?.length || 0;
        console.log(`  🔍 ${nested.title}: category=${hasCategory ? 'есть' : 'НЕТ'}, posts=${hasPosts}`);
        
        if (!hasCategory && hasPosts > 0) {
          console.log(`  ✅ Это подборка!`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Ошибка: ${error.message}`);
  }
}

testSelections(); 