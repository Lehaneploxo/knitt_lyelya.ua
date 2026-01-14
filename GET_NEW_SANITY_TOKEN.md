# 🔴 ПРОБЛЕМА: SANITY TOKEN НЕВАЛИДНЫЙ

## Причина всех проблем:

```
❌ Unauthorized - Session does not match project host
```

Токен Sanity устарел или невалидный. **Поэтому не работают заказы!**

---

## ✅ КАК ИСПРАВИТЬ (5 МИНУТ):

### Шаг 1: Получить новый токен

1. Откройте: https://www.sanity.io/manage
2. Войдите в аккаунт
3. Выберите проект: **alskls9k**
4. Перейдите в **API** → **Tokens**
5. Нажмите **Add API token**

**Настройки токена:**
- Name: `Production Token`
- Permissions: **Editor** (или **Maintainer**)
- Нажмите **Add token**

6. **СКОПИРУЙТЕ ТОКЕН СРАЗУ!** (он показывается только раз)

---

### Шаг 2: Обновить токен в Vercel

Откройте терминал и выполните:

```bash
cd designer-bags-ua

# Удалить старый токен
vercel env rm SANITY_API_TOKEN production --yes

# Добавить новый (вставьте ваш токен вместо YOUR_NEW_TOKEN)
echo "YOUR_NEW_TOKEN" | vercel env add SANITY_API_TOKEN production

# Проверить
vercel env ls
```

---

### Шаг 3: Redeploy

```bash
vercel --prod --yes
```

---

## 📝 ИЛИ СКАЖИТЕ МНЕ ТОКЕН

Получите новый токен из Sanity и скажите мне, я сам обновлю его в Vercel!

**Формат:**
```
НОВЫЙ ТОКЕН: sk...ваш_токен_здесь...
```

---

## ⚡ ПОСЛЕ ЭТОГО ВСЁ ЗАРАБОТАЕТ!

После обновления токена:
- ✅ Заказы будут создаваться
- ✅ Email будет приходить
- ✅ Онлайн оплата будет работать

---

**ЖДУ ВАШИХ ДЕЙСТВИЙ!** 🚀
