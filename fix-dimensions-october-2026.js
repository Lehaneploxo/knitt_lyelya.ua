// Розміри для наборів розділу ДІМ (жовтень 2026): HOME-004/007/013/014/015 та HOME-028 — HOME-032
// Набори з виробів різного розміру показують розміри текстом (dimensions.text)
// Запуск:
//   node fix-dimensions-october-2026.js json  — оновити data/products.json
//   node fix-dimensions-october-2026.js db    — оновити Supabase (після деплою коду!)
require('dotenv').config({ path: '.env.local', quiet: true })
const fs = require('fs')

const text = (ua, en) => ({ text: { ua, en } })

const DIMENSIONS = {
  home_004: text('Ø 26 см, Ø 20 см, h 7 см', 'Ø 26 cm, Ø 20 cm, h 7 cm'),
  home_013: text('Ø 26 см, Ø 20 см, h 7 см', 'Ø 26 cm, Ø 20 cm, h 7 cm'),
  home_007: text('Ø 21 см, 17 x 25 см, h 6,5 см', 'Ø 21 cm, 17 x 25 cm, h 6.5 cm'),
  home_015: text('Ø 21 см, 17 x 25 см, h 6,5 см', 'Ø 21 cm, 17 x 25 cm, h 6.5 cm'),
  home_014: text('Ø 30 см, Ø 25 см, h 7 см', 'Ø 30 cm, Ø 25 cm, h 7 cm'),
  home_028: text('Ø 26 см, Ø 13 см', 'Ø 26 cm, Ø 13 cm'),
  home_029: text('Ø 30 см, Ø 12 см', 'Ø 30 cm, Ø 12 cm'),
  home_030: { diameter: 13, unit: 'cm' },
  home_031: { diameter: 13, unit: 'cm' },
  home_032: text('Ø 20 см, Ø 12 см', 'Ø 20 cm, Ø 12 cm'),
}

function updateJson() {
  const file = './data/products.json'
  const products = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const [id, dimensions] of Object.entries(DIMENSIONS)) {
    products.find(x => x.id === id).dimensions = dimensions
  }
  fs.writeFileSync(file, JSON.stringify(products, null, 2) + '\n')
  console.log('✅ data/products.json оновлено')
}

async function updateDb() {
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  for (const [id, dimensions] of Object.entries(DIMENSIONS)) {
    const { error } = await supabase.from('products').update({ dimensions }).eq('id', id)
    console.log(error ? `❌ ${id}: ${error.message}` : `✅ ${id} — розміри оновлено`)
  }
}

const mode = process.argv[2]
if (mode === 'json') updateJson()
else if (mode === 'db') updateDb().catch(console.error)
else console.log('Вкажіть режим: json або db')
