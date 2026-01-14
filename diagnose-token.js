/**
 * Детальна діагностика Sanity токену
 */

const https = require('https');

const PROJECT_ID = 'alskls9k';
const DATASET = 'production';
const TOKEN = process.env.SANITY_API_TOKEN || 'skoz311ZpiOw5EAUZ9aYkjhK5rkj5Tr7P2Hiv9pvStZ1uKKLz8yB0fvsymm9ejreHtq3KNJx4pNFu5fie0ekDE2YFDN1jckKBgtm4fF9LbEYPPBBjVpyMcVykKRm2eHAZ0k9YOdTyIVIseK0dQyea7Glc7cONq2U4GTtqbcTNV3kvpvTHBaQ';

console.log('🔍 ДІАГНОСТИКА SANITY ТОКЕНУ\n');
console.log('Project ID:', PROJECT_ID);
console.log('Dataset:', DATASET);
console.log('Token (перші 10 символів):', TOKEN ? `${TOKEN.substring(0, 10)}***` : 'НЕ ВСТАНОВЛЕНО');
console.log('Token довжина:', TOKEN.length, 'символів\n');

// Тест 1: Перевірка читання (без токену)
async function testRead() {
  console.log('========================================');
  console.log('ТЕСТ 1: Читання без токену (публічний доступ)');
  console.log('========================================\n');

  const options = {
    hostname: `${PROJECT_ID}.api.sanity.io`,
    port: 443,
    path: `/v2024-01-01/data/query/${DATASET}?query=*[_type == "product"][0...1]`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Статус:', res.statusCode);
        if (res.statusCode === 200) {
          console.log('✅ УСПІХ! Проєкт існує і доступний для читання');
          try {
            const parsed = JSON.parse(data);
            console.log('Кількість продуктів:', parsed.result?.length || 0);
          } catch (e) {
            console.log('Відповідь:', data.substring(0, 200));
          }
        } else {
          console.log('❌ ПОМИЛКА!');
          console.log('Відповідь:', data);
        }
        console.log('');
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log('❌ КРИТИЧНА ПОМИЛКА:', e.message);
      console.log('');
      resolve();
    });

    req.end();
  });
}

// Тест 2: Перевірка токену на запис
async function testWrite() {
  console.log('========================================');
  console.log('ТЕСТ 2: Запис з токеном');
  console.log('========================================\n');

  const testDoc = {
    mutations: [
      {
        create: {
          _type: 'order',
          orderNumber: 'DIAGNOSE-' + Date.now(),
          customerName: 'Test Diagnostic',
          customerEmail: 'test@test.com',
          customerPhone: '+380501234567',
          items: [],
          totalAmount: 0,
          paymentStatus: 'not_paid',
          deliveryMethod: 'test',
          deliveryAddress: 'Test',
          orderDate: new Date().toISOString(),
          notes: 'Diagnostic test order'
        }
      }
    ]
  };

  const options = {
    hostname: `${PROJECT_ID}.api.sanity.io`,
    port: 443,
    path: `/v2024-01-01/data/mutate/${DATASET}?returnIds=true`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Статус:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers, null, 2));

        if (res.statusCode === 200) {
          console.log('✅ УСПІХ! Токен працює!');
          try {
            const parsed = JSON.parse(data);
            console.log('Створено документ ID:', parsed.results?.[0]?.id);

            // Видалимо тестовий документ
            if (parsed.results?.[0]?.id) {
              deleteTestDoc(parsed.results[0].id);
            }
          } catch (e) {
            console.log('Відповідь:', data.substring(0, 500));
          }
        } else {
          console.log('❌ ПОМИЛКА!');
          console.log('Відповідь:', data);
        }
        console.log('');
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log('❌ КРИТИЧНА ПОМИЛКА:', e.message);
      console.log('');
      resolve();
    });

    req.write(JSON.stringify(testDoc));
    req.end();
  });
}

// Видалення тестового документа
async function deleteTestDoc(docId) {
  console.log('\n🗑️  Видалення тестового документа...');

  const deleteDoc = {
    mutations: [
      {
        delete: { id: docId }
      }
    ]
  };

  const options = {
    hostname: `${PROJECT_ID}.api.sanity.io`,
    port: 443,
    path: `/v2024-01-01/data/mutate/${DATASET}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Тестовий документ видалено');
        }
        resolve();
      });
    });

    req.on('error', () => resolve());

    req.write(JSON.stringify(deleteDoc));
    req.end();
  });
}

// Запуск діагностики
async function runDiagnosis() {
  await testRead();
  await testWrite();

  console.log('========================================');
  console.log('📊 ВИСНОВОК');
  console.log('========================================\n');
  console.log('Якщо Тест 1 успішний, але Тест 2 помилковий:');
  console.log('- Перевірте що токен створений для проєкту:', PROJECT_ID);
  console.log('- Перевірте права токену (має бути Editor або Maintainer)');
  console.log('- Токен може бути від іншого проєкту в організації');
}

runDiagnosis();
