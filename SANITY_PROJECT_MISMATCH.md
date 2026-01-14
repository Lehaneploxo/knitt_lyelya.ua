# 🔴 ПРОБЛЕМА: НЕСООТВЕТСТВИЕ ПРОЕКТА SANITY

## Что происходит:

Ошибка:
```
❌ Unauthorized - Session does not match project host
```

## Причина:

**Токен от ДРУГОГО проекта Sanity!**

### В коде сейчас:
```
Project ID: alskls9k
```

### Токен который вы дали:
```
skIwGmvxRL6ZdV3JM5cRkPBukFzYa84xDH4JrBlNK3Gpc6AmnSUB97XLF5db0otNhk9WGLBGV10UVUMJ0vaQfI6BxFlMaHqicbwvXwRGdXP3qK4swvq1Zge1TFGmFnON9pmhHk8jbcf4NeV0nqTkFy3xMAxAUng5hxkymFI3G2wLnrVUfvs1
```

**Этот токен от проекта "mirorw" (со скриншота), а не от "alskls9k"!**

---

## ✅ ДВА ВАРИАНТА РЕШЕНИЯ:

### ВАРИАНТ 1: Получить токен от правильного проекта

1. Откройте: https://www.sanity.io/manage
2. Найдите проект с ID: **alskls9k**
3. Зайдите в **API** → **Tokens**
4. Создайте новый токен:
   - Name: `Production Token`
   - Permissions: **Editor** или **Maintainer**
5. Скопируйте токен и дайте мне

### ВАРИАНТ 2: Использовать проект "mirorw"

Если правильный проект - это "mirorw", тогда:

1. Узнайте Project ID проекта "mirorw"
2. Скажите мне этот ID
3. Я обновлю код чтобы использовать правильный проект

---

## 🤔 КАКОЙ ПРОЕКТ ПРАВИЛЬНЫЙ?

**Вопрос к вам:**

Какой проект в Sanity содержит ваши заказы и данные для сайта knittlyelyaua.com?

1. `alskls9k` (сейчас в коде)
2. `mirorw` (со скриншота)
3. Другой?

**Скажите мне:**
- Название проекта
- Project ID (найдете в https://www.sanity.io/manage)

И я все исправлю!

---

## 📍 ГДЕ НАЙТИ PROJECT ID:

1. Откройте https://www.sanity.io/manage
2. Выберите нужный проект
3. В URL увидите: `...sanity.io/manage/.../{PROJECT_ID}/...`
4. Или в настройках проекта: **Settings** → **Project details**
