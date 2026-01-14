require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'alskls9k',
  dataset: 'production', // Спробуємо production
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function checkDatasets() {
  try {
    console.log('🔍 Перевіряю доступ до Sanity...\n');
    console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'alskls9k');
    console.log('Dataset:', 'production');
    console.log('Token:', process.env.SANITY_API_TOKEN ? 'Є' : 'НЕМАЄ!\n');

    // Спробуємо отримати товари
    const result = await client.fetch('*[_type == "product"][0...5]');
    console.log('\n✅ З\'єднання успішне!');
    console.log(`📦 Знайдено ${result.length} товарів`);

    if (result.length > 0) {
      console.log('\nПерший товар:');
      console.log(result[0]);
    }
  } catch (error) {
    console.error('\n❌ Помилка:', error.message);

    if (error.message.includes('Dataset') || error.message.includes('not found')) {
      console.log('\n💡 Рішення: Потрібно створити датасет "production" в Sanity');
      console.log('Або змінити dataset на інший (наприклад "development")');
    }

    if (error.message.includes('Unauthorized')) {
      console.log('\n💡 Рішення: Потрібен новий токен Sanity');
    }
  }
}

checkDatasets();
