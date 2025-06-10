const https = require('https');

async function checkSelection(slug) {
  return new Promise((resolve) => {
    const url = `https://admin.burspb.com/data/v1/categories/${slug}`;
    console.log(`Проверяю: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`\n=== ${slug} ===`);
          console.log('Category:', result.category);
          console.log('Posts count:', result.posts ? result.posts.length : 0);
          console.log('Has category:', !!result.category);
          console.log('Has posts:', !!(result.posts && result.posts.length > 0));
          console.log('Is selection (no category + has posts):', !result.category && result.posts && result.posts.length > 0);
          resolve(result);
        } catch (e) {
          console.error('Error parsing JSON:', e.message);
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.error('Request error:', e.message);
      resolve(null);
    });
  });
}

async function main() {
  // Проверяем известные подборки
  const selections = [
    'pnevmoudarniki-110-mm',
    'pnevmoudarniki-130-mm', 
    'pnevmoudarniki-150-mm'
  ];
  
  for (const slug of selections) {
    await checkSelection(slug);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

main(); 