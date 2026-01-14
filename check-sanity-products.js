const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'alskls9k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || 'skFevW9cg8AArRkqRJZBothK14NbuEa8nAHLIwZUsBql7nzEu3EBXAtsmNXYChIVqKBY6CRkkIFzLHGo8OtMKlAtyoMZRQeYsGxkqfqebYDpiOKAMUaO00Ls2OcyOEMe6Cupdwm6uYb6WyTM3NfbDi6TTmW9uyxny45suJoaEJ16zIuN16Pw',
  useCdn: false,
});

async function checkProducts() {
  console.log('🔍 Перевіряю товари в Sanity...\n');

  try {
    const products = await client.fetch('*[_type == "product"]');
    console.log(`📦 Знайдено ${products.length} товарів у Sanity\n`);

    if (products.length > 0) {
      console.log('Перші 3 товари:');
      products.slice(0, 3).forEach(p => {
        console.log(`- ${p.name_ua} (${p._id})`);
      });
    } else {
      console.log('❌ Товарів немає! Потрібно завантажити з JSON.');
    }
  } catch (error) {
    console.error('❌ Помилка:', error.message);
  }
}

checkProducts();
