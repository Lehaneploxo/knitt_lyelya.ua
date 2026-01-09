const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'alskls9k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || 'skFevW9cg8AArRkqRJZBothK14NbuEa8nAHLIwZUsBql7nzEu3EBXAtsmNXYChIVqKBY6CRkkIFzLHGo8OtMKlAtyoMZRQeYsGxkqfqebYDpiOKAMUaO00Ls2OcyOEMe6Cupdwm6uYb6WyTM3NfbDi6TTmW9uyxny45suJoaEJ16zIuN16Pw',
  useCdn: false,
});

async function migrateProducts() {
  try {
    console.log('🚀 Починаю міграцію товарів...');

    // Читаємо products.json
    const productsPath = path.join(__dirname, 'data', 'products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    console.log(`📦 Знайдено ${productsData.length} товарів`);

    let success = 0;
    let errors = 0;

    for (const product of productsData) {
      try {
        console.log(`\n⏳ Обробка: ${product.name.ua}...`);

        // Створюємо slug
        const slug = product.name.en
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

        // Формуємо документ для Sanity
        const sanityProduct = {
          _type: 'product',
          _id: product.id, // Використовуємо ID з JSON
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
        };

        // Створюємо або оновлюємо товар
        await client.createOrReplace(sanityProduct);

        console.log(`✅ Успішно: ${product.name.ua}`);
        success++;

      } catch (error) {
        console.error(`❌ Помилка для ${product.name?.ua}:`, error.message);
        errors++;
      }
    }

    console.log(`\n\n🎉 ГОТОВО!`);
    console.log(`✅ Успішно перенесено: ${success} товарів`);
    if (errors > 0) {
      console.log(`❌ Помилок: ${errors}`);
    }

  } catch (error) {
    console.error('💥 Критична помилка:', error);
  }
}

migrateProducts();
