# Налаштування таблиці products в Supabase

## Швидке налаштування (1 хвилина)

### КРОК 1: Відкрийте Supabase Dashboard

Відкрийте: https://supabase.com/dashboard/project/pzfblgxfwvbnfbtdctun/editor

### КРОК 2: Створіть таблицю

1. Перейдіть в "SQL Editor" (ліва панель)
2. Натисніть "New query"
3. Скопіюйте і вставте SQL з файлу `supabase-products-table.sql`:

```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name_ua TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description_ua TEXT,
  description_en TEXT,
  category TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  sku TEXT,
  images JSONB,
  materials JSONB,
  colors JSONB,
  dimensions JSONB,
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
```

4. Натисніть "Run" (або Ctrl+Enter)

### КРОК 3: Готово!

Тепер:
1. Відкрийте адмінку: `/admin`
2. Натисніть "📥 Імпортувати товари"
3. Всі 55 товарів завантажаться в Supabase
4. Редагування працюватиме!

---

## Переваги Supabase

✅ Працює на Vercel
✅ Безкоштовно до 500MB
✅ Швидше ніж Sanity
✅ Повний контроль через SQL
