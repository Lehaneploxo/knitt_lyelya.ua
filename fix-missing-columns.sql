-- Додавання пропущених колонок до таблиці products
-- Виконати в Supabase SQL Editor

-- Додати колонку price_eur якщо її немає
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_eur DECIMAL(10, 2);

-- Додати колонку materials якщо її немає
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials JSONB;

-- Додати колонку colors якщо її немає
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors JSONB;

-- Додати колонку dimensions якщо її немає
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB;

-- Додати колонку is_new якщо її немає
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;

-- Додати колонку is_bestseller якщо її немає
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false;

-- Перевірити структуру таблиці
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
