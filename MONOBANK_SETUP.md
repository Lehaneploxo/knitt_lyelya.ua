# Налаштування Monobank оплати

Цей файл містить інструкції для налаштування онлайн оплати через Monobank.

## Що було зроблено

1. ✅ Додано змінні середовища в `.env.local`
2. ✅ Створено API endpoint `/api/payment/create-invoice` для створення рахунків
3. ✅ Створено webhook `/api/payment/webhook` для обробки статусів платежів
4. ✅ Оновлено форму checkout для підтримки онлайн оплати
5. ✅ Додано поля в Sanity схему для зберігання інформації про платежі
6. ✅ Створено схему для логування webhooks

## Кроки для завершення налаштування

### 1. Отримайте Monobank API Token

1. Зв'яжіться з Monobank підтримкою для бізнесу
2. Запросіть API токен для еквайрингу
3. Дочекайтеся підтвердження та отримання токену

### 2. Налаштуйте змінні середовища

Відкрийте файл `.env.local` та замініть `YOUR_MONOBANK_TOKEN_HERE` на ваш реальний токен:

```env
MONOBANK_TOKEN=ваш_реальний_токен_від_monobank
NEXT_PUBLIC_BASE_URL=https://www.knittlyelyaua.com
```

**ВАЖЛИВО:** Для локальної розробки використовуйте ngrok або подібний сервіс для отримання публічного URL, щоб Monobank міг надсилати webhooks.

### 3. Розгорніть оновлення на продакшн

```bash
npm run build
# або якщо використовуєте Vercel
vercel --prod
```

### 4. Налаштуйте webhook URL в Monobank

Webhook URL встановлюється автоматично при створенні кожного invoice, але ви можете перевірити, що він правильний:

```
https://www.knittlyelyaua.com/api/payment/webhook
```

Цей URL Monobank буде використовувати для надсилання статусів платежів.

### 5. Тестування

#### Тестування на локальному сервері (з ngrok):

1. Запустіть ngrok:
   ```bash
   ngrok http 3000
   ```

2. Оновіть `NEXT_PUBLIC_BASE_URL` в `.env.local` на ngrok URL:
   ```env
   NEXT_PUBLIC_BASE_URL=https://your-ngrok-url.ngrok.io
   ```

3. Перезапустіть сервер:
   ```bash
   npm run dev
   ```

4. Зробіть тестове замовлення з онлайн оплатою

#### Перевірка webhook endpoint:

Відкрийте в браузері або через curl:
```bash
curl https://www.knittlyelyaua.com/api/payment/webhook
```

Повинен повернутися JSON:
```json
{
  "message": "Monobank webhook endpoint is active",
  "timestamp": "2026-01-09T..."
}
```

### 6. Моніторинг платежів

Ви можете переглядати всю інформацію про платежі в Sanity Studio:

1. Відкрийте Sanity Studio: `http://localhost:3000/studio`
2. Перейдіть до "Замовлення / Orders" - тут ви побачите статуси оплати
3. Перейдіть до "Payment Webhooks" - тут зберігаються всі webhooks від Monobank

## Як працює онлайн оплата

1. **Користувач оформляє замовлення** з методом оплати "Картою онлайн"
2. **Створюється замовлення** в базі даних Sanity зі статусом "not_paid"
3. **Створюється Monobank invoice** через API
4. **Користувач перенаправляється** на сторінку оплати Monobank
5. **Після оплати:**
   - Якщо успішно - Monobank надсилає webhook зі статусом "success"
   - Webhook оновлює статус замовлення в Sanity на "paid"
   - Користувач перенаправляється на сторінку успіху

## Структура файлів

```
designer-bags-ua/
├── app/
│   ├── api/
│   │   ├── payment/
│   │   │   ├── create-invoice/
│   │   │   │   └── route.ts          # Створення Monobank invoice
│   │   │   └── webhook/
│   │   │       └── route.ts          # Обробка webhooks від Monobank
│   │   └── orders/
│   │       └── create/
│   │           └── route.ts          # Створення замовлення
│   └── checkout/
│       └── page.tsx                   # Форма оформлення замовлення
├── sanity/
│   └── schemas/
│       ├── order.ts                   # Схема замовлення (оновлена)
│       ├── paymentWebhook.ts         # Схема для webhooks
│       └── index.ts                   # Експорт схем
└── .env.local                         # Змінні середовища
```

## API Документація Monobank

Офіційна документація: https://monobank.ua/api-docs/acquiring

### Основні поля при створенні invoice:

- `amount` - сума в копійках (множимо на 100)
- `ccy` - код валюти (980 для UAH)
- `merchantPaymInfo.reference` - номер замовлення
- `redirectUrl` - URL для повернення після оплати
- `webHookUrl` - URL для отримання статусів
- `validity` - час дії invoice в секундах

### Статуси платежів:

- `created` - створено
- `processing` - обробляється
- `hold` - холд
- `success` - успішно
- `failure` - помилка
- `reversed` - скасовано
- `expired` - прострочено

## Troubleshooting

### Webhook не працює
- Перевірте, що NEXT_PUBLIC_BASE_URL правильний
- Перевірте, що сайт доступний публічно (не localhost без ngrok)
- Перевірте логи в Sanity Studio -> Payment Webhooks

### Платіж не створюється
- Перевірте MONOBANK_TOKEN в .env.local
- Перевірте консоль браузера та серверні логи
- Переконайтеся, що токен активний і має права на створення invoice

### Статус замовлення не оновлюється
- Перевірте, що webhook endpoint доступний публічно
- Перевірте логи в Payment Webhooks
- Переконайтеся, що номер замовлення правильно передається в reference

## Контакти

Якщо виникають проблеми з інтеграцією Monobank:
- Технічна підтримка Monobank: https://monobank.ua/
- Документація API: https://monobank.ua/api-docs/acquiring
