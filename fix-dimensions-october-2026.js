// Розміри для наборів розділу ДІМ (жовтень 2026): HOME-004/007/013/014/015 та HOME-028 — HOME-032
// Набори з виробів різного розміру показують розміри текстом (dimensions.text)
// Запуск:
//   node fix-dimensions-october-2026.js json  — оновити data/products.json
//   node fix-dimensions-october-2026.js db    — оновити Supabase (після деплою коду!)
require('dotenv').config({ path: '.env.local', quiet: true })
const fs = require('fs')

const text = (ua, en) => ({ text: { ua, en } })

const DIMENSIONS = {
  home_004: text('підтарільники Ø 26 см; кошик Ø 20 см, висота 7 см', 'placemats Ø 26 cm; basket Ø 20 cm, height 7 cm'),
  home_013: text('підтарільники Ø 26 см; кошик Ø 20 см, висота 7 см', 'placemats Ø 26 cm; basket Ø 20 cm, height 7 cm'),
  home_007: text('підтарільники Ø 21 см; кошик 17 x 25 см, висота 6,5 см', 'placemats Ø 21 cm; basket 17 x 25 cm, height 6.5 cm'),
  home_015: text('підтарільники Ø 21 см; кошик 17 x 25 см, висота 6,5 см', 'placemats Ø 21 cm; basket 17 x 25 cm, height 6.5 cm'),
  home_014: text('підтарільники Ø 30 см; кошик Ø 25 см, висота 7 см', 'placemats Ø 30 cm; basket Ø 25 cm, height 7 cm'),
  home_028: text('серветка Ø 26 см; підставки під чашки Ø 13 см', 'placemat Ø 26 cm; coasters Ø 13 cm'),
  home_029: text('серветка Ø 30 см; підставки під чашки Ø 12 см', 'placemat Ø 30 cm; coasters Ø 12 cm'),
  home_030: { diameter: 13, unit: 'cm' },
  home_031: { diameter: 13, unit: 'cm' },
  home_032: text('підставка під заварник Ø 20 см; підставки під чашки Ø 12 см', 'teapot stand Ø 20 cm; coasters Ø 12 cm'),
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
