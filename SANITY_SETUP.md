# Налаштування Sanity CMS

## Крок 1: Створення проекту Sanity

1. Відкрийте https://www.sanity.io/
2. Натисніть "Get started" або "Sign up"
3. Увійдіть через GitHub, Google або email
4. Після входу натисніть "Create new project"
5. Введіть назву проекту: **Designer Bags UA**
6. Виберіть план: **Free** (безкоштовно)
7. Виберіть dataset: **production**

## Крок 2: Отримання Project ID

Після створення проекту:
1. Відкрийте https://www.sanity.io/manage
2. Виберіть ваш проект "Designer Bags UA"
3. В лівому меню натисніть "Settings"
4. Скопіюйте **Project ID** (виглядає як: abc123xyz)

## Крок 3: Створення API Token

1. В налаштуваннях проекту перейдіть в "API" → "Tokens"
2. Натисніть "Add API token"
3. Введіть назву: "Website Token"
4. Виберіть права: **Editor** (для можливості додавати товари)
5. Натисніть "Save"
6. Скопіюйте токен (показується тільки один раз!)

## Крок 4: Налаштування змінних оточення

1. В папці проекту `designer-bags-ua` створіть файл `.env.local`
2. Додайте такі рядки:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=ваш-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=ваш-api-token
```

3. Замініть `ваш-project-id` та `ваш-api-token` на скопійовані значення

## Крок 5: Запуск адмінки

```bash
npm run dev
```

Потім відкрийте:
- **Адмінка:** http://localhost:3000/studio
- **Сайт:** http://localhost:3000

## Готово!

Тепер ви можете додавати товари через адмінку!
