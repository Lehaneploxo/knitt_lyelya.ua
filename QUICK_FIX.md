# 🚀 БЫСТРОЕ ИСПРАВЛЕНИЕ ОПЛАТЫ

## 🔴 ПРОБЛЕМА
Онлайн оплата через Monobank не работает из-за лишних символов `\n` в переменных окружения Vercel.

## ✅ РЕШЕНИЕ (5 МИНУТ)

### Вариант 1: Автоматически (РЕКОМЕНДУЕТСЯ)

```bash
cd designer-bags-ua
node fix-vercel-env.js
```

Следуйте инструкциям на экране.

### Вариант 2: Вручную через Vercel Dashboard

1. **Откройте:** https://vercel.com/lehaneploxos-projects/designer-bags-ua
2. **Settings → Environment Variables**
3. **Удалите и добавьте заново:**

```
MONOBANK_TOKEN = mEV7ptuaG1LcHiw1viKbAaQ
NEXT_PUBLIC_BASE_URL = https://www.knittlyelyaua.com
SHOP_NAME = knitt_lyelya.ua
NOTIFICATION_EMAIL = knitt.lyelya531@gmail.com
GMAIL_USER = knitt.lyelya531@gmail.com
GMAIL_APP_PASSWORD = qiyuuhzinhfqtxic
```

⚠️ **БЕЗ пробелов, БЕЗ Enter, БЕЗ переносов строк!**

4. **Сделайте Redeploy:**
   - Deployments → Последний → ⋯ → Redeploy

5. **Готово!** Через 1-2 минуты оплата заработает.

## 🧪 ПРОВЕРКА

Откройте: https://www.knittlyelyaua.com
1. Добавьте товар в корзину
2. Оформите заказ
3. Выберите "Картою онлайн"
4. Должен открыться сайт Monobank для оплаты

## 📖 ПОДРОБНАЯ ИНСТРУКЦИЯ

Смотрите файл: `PAYMENT_PROBLEM_SOLUTION.md`

## 💡 ЧТО БЫЛО НЕ ТАК

```
БЫЛО: MONOBANK_TOKEN="mEV7ptuaG1LcHiw1viKbAaQ\n"  ❌
СТАЛО: MONOBANK_TOKEN="mEV7ptuaG1LcHiw1viKbAaQ"  ✅
```

Символ `\n` в конце ломал запросы к Monobank API.

---

**Если не получится - читайте PAYMENT_PROBLEM_SOLUTION.md**
