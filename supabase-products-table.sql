-- Створення таблиці products в Supabase
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

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Тригер для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at_trigger
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();
