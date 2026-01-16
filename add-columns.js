// Додавання колонок через Supabase REST API
const https = require('https')

const supabaseUrl = 'pzfblgxfwvbnfbtdctun.supabase.co'
const supabaseServiceKey = 'sb_secret_saVwbawoH8jRbbPZVkPJUQ_OTseDYWz'

const sql = `
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_eur DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false;
`

const data = JSON.stringify({ query: sql })

const options = {
  hostname: supabaseUrl,
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseServiceKey,
    'Authorization': `Bearer ${supabaseServiceKey}`,
    'Content-Length': data.length
  }
}

console.log('🔧 Пробую додати колонки через RPC...')

const req = https.request(options, (res) => {
  let body = ''
  res.on('data', (chunk) => body += chunk)
  res.on('end', () => {
    console.log('Status:', res.statusCode)
    console.log('Response:', body)
    if (res.statusCode === 200 || res.statusCode === 204) {
      console.log('✅ Колонки додано!')
    } else {
      console.log('❌ Не вдалося через RPC')
    }
  })
})

req.on('error', (e) => {
  console.error('Error:', e.message)
})

req.write(data)
req.end()
