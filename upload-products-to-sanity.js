require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'alskls9k',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function uploadProducts() {
  try {
    console.log('🚀 Починаю завантаження товарів у Sanity...\n');

    // Читаємо товари з JSON
    const productsPath = path.join(__dirname, 'data', 'products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    console.log(`📦 Знайдено ${products.length} товарів у JSON\n`);

    let success = 0;
    let errors = 0;

    for (const product of products) {
      try {
        console.log(`⏳ Завантажую: ${product.name.ua}...`);

        // Створюємо slug
        const slug = product.name.en
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

        // Створюємо товар в Sanity
        const result = await client.create({
          _type: 'product',
          _id: product.id, // Використовуємо існуючий ID
          name_ua: product.name.ua,
          name_en: product.name.en,
          slug: {
            _type: 'slug',
            current: slug,
          },
          sku: product.sku || product.id,
          price: product.price,
          discount: 0,
          category: product.category,
          description_ua: product.description?.ua || '',
          description_en: product.description?.en || '',
          materials: product.materials || [],
          colors: product.colors || [],
          dimensions: product.dimensions ? {
            height: product.dimensions.height,
            width: product.dimensions.width,
            depth: product.dimensions.depth,
          } : undefined,
          inStock: product.inStock !== false,
          isNew: product.new === true,
          isBestseller: product.featured === true,
          images: [], // Фото додамо пізніше через Sanity Studio
        });

        console.log(`✅ Успішно: ${product.name.ua}`);
        success++;

      } catch (error) {
        if (error.message.includes('Document with ID')) {
          console.log(`⚠️  Вже існує: ${product.name.ua}`);
          success++;
        } else {
          console.error(`❌ Помилка для ${product.name.ua}:`, error.message);
          errors++;
        }
      }
    }

    console.log(`\n\n🎉 ГОТОВО!`);
    console.log(`✅ Успішно завантажено: ${success} товарів`);
    if (errors > 0) {
      console.log(`❌ Помилок: ${errors}`);
    }

  } catch (error) {
    console.error('💥 Критична помилка:', error.message);
  }
}

uploadProducts();
