# Налаштування змінних оточення на Vercel

## КРИТИЧНО ВАЖЛИВО! ⚠️

Щоб email працювали на продакшн сайті, потрібно додати змінні оточення в Vercel.

---

## Інструкція по додаванню змінних на Vercel:

### Крок 1: Відкрийте Dashboard Vercel

1. Перейдіть на https://vercel.com
2. Увійдіть в акаунт
3. Виберіть проект **knitt-lyelya-ua**

### Крок 2: Перейдіть в налаштування

1. Натисніть на вкладку **"Settings"** (вгорі)
2. У лівому меню виберіть **"Environment Variables"**

### Крок 3: Додайте змінні

Додайте ці дві змінні:

#### Змінна 1: GMAIL_USER
- **Name:** `GMAIL_USER`
- **Value:** `knitt.lyelya531@gmail.com`
- **Environment:** Виберіть всі (Production, Preview, Development)
- Натисніть **"Save"**

#### Змінна 2: GMAIL_APP_PASSWORD
- **Name:** `GMAIL_APP_PASSWORD`
- **Value:** `qiyuuhzinhfqtxic`
- **Environment:** Виберіть всі (Production, Preview, Development)
- Натисніть **"Save"**

### Крок 4: Перевірте інші змінні

Переконайтеся що є ці змінні (якщо немає - додайте):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=alskls9k
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=ваш_токен
MONOBANK_TOKEN=ваш_токен
NEXT_PUBLIC_BASE_URL=https://www.knittlyelyaua.com
SHOP_NAME=knitt_lyelya.ua
NOTIFICATION_EMAIL=knitt.lyelya531@gmail.com
```

### Крок 5: Redeploy

Після додавання змінних:

1. Перейдіть на вкладку **"Deployments"**
2. Знайдіть останній деплой (самий верхній)
3. Натисніть **три крапки** (⋯) справа
4. Виберіть **"Redeploy"**
5. Підтвердіть **"Redeploy"**

Або просто почекайте - Vercel автоматично задеплоїть після push на GitHub.

---

## Перевірка після деплою:

### 1. Дочекайтеся завершення деплою
Vercel покаже статус "Ready" зеленою галочкою ✅

### 2. Відкрийте сайт
https://www.knittlyelyaua.com

### 3. Протестуйте замовлення
- Додайте товар в кошик
- Оформіть замовлення
- Перевірте що email прийшов на knitt.lyelya531@gmail.com

---

## Що буде працювати після деплою:

✅ **Email власнику** - при створенні замовлення
✅ **Email клієнту** - після успішної оплати
✅ **Monobank оплата** - приймання платежів
✅ **Admin панель** - управління товарами та замовленнями

---

## Troubleshooting

### Email не приходять на продакшн

1. Перевірте що змінні додані в Vercel
2. Перевірте що обрали всі environments (Production, Preview, Development)
3. Зробіть Redeploy
4. Перевірте логи в Vercel -> Deployments -> Latest -> Logs

### Як перевірити логи

1. Vercel Dashboard → Ваш проект
2. Deployments → Останній деплой
3. Functions → api/send-order-email
4. Перегляньте логи помилок

---

**ГОТОВО!** Після додавання змінних сайт буде повністю готовий до роботи! 🎉
