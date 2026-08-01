-- Додає колонку для збереження Monobank invoiceId, щоб webhook міг
-- перевірити що запит стосується реально створеного рахунку цього замовлення.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_id TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_invoice_id ON orders(invoice_id);
