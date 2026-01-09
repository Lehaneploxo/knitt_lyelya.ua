# Налаштування email підтвердження оплати

**ВАЖЛИВО:** Цей проект використовує Gmail SMTP через Nodemailer для відправки email.

📖 **Повна інструкція по налаштуванню Gmail:** Дивіться файл [GMAIL_SETUP.md](./GMAIL_SETUP.md)

## Що було реалізовано

1. ✅ Встановлено пакет `nodemailer` для відправки email через Gmail SMTP
2. ✅ Створено API endpoint `/api/send-payment-confirmation` для відправки email клієнтам
3. ✅ Оновлено webhook `/api/payment/webhook` для автоматичної відправки email після успішної оплати
4. ✅ Додано змінні `GMAIL_USER` та `GMAIL_APP_PASSWORD` в `.env.local`
5. ✅ Створено красивий HTML template для email підтвердження

## Швидкий старт (короткі інструкції)

### 1. Увімкніть двофакторну автентифікацію (2FA) в Gmail

1. Перейдіть на https://myaccount.google.com/security
2. Увімкніть "Двоетапна перевірка"

### 2. Створіть App Password

1. Перейдіть на https://myaccount.google.com/apppasswords
2. Створіть новий App Password для "Пошта"
3. Скопіюйте 16-значний пароль (без пробілів!)

### 3. Додайте App Password в `.env.local`

Відкрийте файл `designer-bags-ua/.env.local` і замініть:

```env
GMAIL_APP_PASSWORD=YOUR_GMAIL_APP_PASSWORD_HERE
```

на ваш реальний App Password (БЕЗ пробілів):

```env
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

### 4. Перезапустіть сервер

```bash
cd designer-bags-ua
npm run dev
```

Для продакшн:
```bash
npm run build
vercel --prod
```

## Як працює відправка email

### Потік для клієнта:
1. **Клієнт оформляє замовлення** з методом оплати "Картою онлайн"
2. **Створюється замовлення** в Sanity з email клієнта
3. **Клієнт оплачує** через Monobank
4. **Monobank надсилає webhook** зі статусом "success"
5. **Webhook оновлює статус** замовлення на "paid"
6. **Автоматично відправляється email** клієнту з підтвердженням оплати ✉️

### Потік для власника:
1. При створенні замовлення email відправляється на `NOTIFICATION_EMAIL` (knitt.lyelya531@gmail.com)

## Структура файлів

```
designer-bags-ua/
├── app/
│   ├── api/
│   │   ├── send-payment-confirmation/
│   │   │   └── route.ts              # Новий endpoint для email клієнтам
│   │   ├── send-order-email/
│   │   │   └── route.ts              # Існуючий endpoint для email власнику
│   │   └── payment/
│   │       └── webhook/
│   │           └── route.ts          # Оновлений webhook (тепер відправляє email)
└── .env.local                         # Оновлено (додано RESEND_API_KEY)
```

## Email Templates

### 1. Email власнику магазину (`send-order-email`)
- Відправляється: при створенні замовлення
- Кому: `NOTIFICATION_EMAIL` (власник)
- Тема: "🛍️ Нове замовлення #..."
- Містить: інформацію про покупця, товари, доставку, оплату

### 2. Email клієнту (`send-payment-confirmation`)
- Відправляється: після успішної оплати
- Кому: email клієнта з замовлення
- Тема: "✅ Оплата підтверджена - Замовлення #..."
- Містить: підтвердження оплати, деталі замовлення, що далі

## Тестування

### Тест 1: Перевірка endpoint (без відправки email)
```bash
curl http://localhost:3000/api/send-payment-confirmation \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"customerEmail":"test@example.com", "customerName":"Тест", "orderNumber":"123456", "totalAmount":1000, "items":[{"name":"Тестова сумка", "quantity":1, "price":1000}], "deliveryMethod":"novaposhta", "deliveryAddress":"Київ"}'
```

### Тест 2: Реальне замовлення з оплатою
1. Перейдіть на сайт: http://localhost:3000
2. Додайте товар в кошик
3. Оформіть замовлення з методом "Картою онлайн"
4. Використайте тестову картку Monobank (якщо доступна)
5. Перевірте email клієнта

### Тест 3: Перевірка логів
Після успішної оплати перевірте:
- Консоль сервера: `Payment confirmation email sent to ...`
- Sanity Studio -> Payment Webhooks: статус "success"
- Email клієнта

## Моніторинг

### Resend Dashboard
- Перейдіть на https://resend.com/emails
- Переглядайте статус відправлених email
- Перевіряйте відкриття та доставку

### Sanity Studio
- Відкрийте: http://localhost:3000/studio
- Перейдіть до "Payment Webhooks"
- Перевіряйте логи webhooks

### Логи сервера
```bash
# Дивитись логи в реальному часі
npm run dev

# Шукати логи email
grep "email" .next/server/app/api/payment/webhook/*.log
```

## Troubleshooting

### Email не відправляється
1. **Перевірте RESEND_API_KEY**
   ```bash
   # В .env.local
   echo $RESEND_API_KEY
   ```

2. **Перевірте логи**
   - Консоль сервера
   - Resend Dashboard -> Logs

3. **Перевірте ліміти**
   - Безкоштовний план: 100 emails/день, 3000/місяць
   - Resend Dashboard -> Usage

### Email йде в спам
1. Додайте власний домен (інструкція вище)
2. Налаштуйте SPF, DKIM, DMARC записи в DNS
3. Не використовуйте спам-слова в темі

### Webhook не спрацьовує
1. Перевірте, що сайт доступний публічно
2. Перевірте URL: `https://www.knittlyelyaua.com/api/payment/webhook`
3. Перевірте логи в Sanity Studio -> Payment Webhooks

### Email відправляється двічі
- Перевірте, що webhook не викликається двічі
- Перевірте логи в Payment Webhooks
- Можливо, Monobank надсилає дублікат (нормально)

## Додаткові можливості

### Додати інші email
Можна створити додаткові endpoints для:
- Email при відправці замовлення
- Email при доставці
- Email нагадування про замовлення
- Email скасування замовлення

### Персоналізація
У файлі `send-payment-confirmation/route.ts` можна:
- Змінити дизайн email (HTML)
- Додати логотип
- Додати соціальні мережі
- Додати знижку на наступне замовлення

### Аналітика
Resend надає:
- Статистику відкриття email
- Статистику кліків
- Статистику доставки
- Webhook для подій email

## Підтримка

Якщо виникають проблеми:
- Документація Resend: https://resend.com/docs
- Підтримка Resend: support@resend.com
- GitHub Issues: https://github.com/resendlabs/resend-node

## Безпека

⚠️ **ВАЖЛИВО:**
- Не публікуйте `RESEND_API_KEY` в Git
- Додайте `.env.local` в `.gitignore`
- Використовуйте різні ключі для dev/prod
- Регулярно оновлюйте ключі

## Вартість

Resend ціни (станом на 2025):
- **Free**: 100 emails/день, 3000/місяць
- **Pro ($20/міс)**: 50,000 emails/місяць
- **Business**: Custom pricing

Для середнього інтернет-магазину **Free плану достатньо**.
