// Оновлення розділу ДІМ (жовтень 2026): набори підтарільників з хлібними кошиками + новий HOME-027
// Запуск:
//   node update-october-2026.js json  — оновити data/products.json
//   node update-october-2026.js db    — оновити Supabase (після деплою фото!)
require('dotenv').config({ path: '.env.local', quiet: true })
const fs = require('fs')

const IMG = '/images/products/'

const UPDATES = {
  home_004: {
    name: { ua: 'Набір Ажур', en: 'Openwork set' },
    price: 930,
    description: {
      ua: 'Вишуканий набір з 2 підтарільників з ажурним плетінням з натурального джуту та хлібного кошика. Діаметр підтарільників - 26 см, розміри кошика - 20 см в діаметрі, висота - 7 см. Матеріал - джут, дерево. Ідеальний подарунок для цінителів ручної роботи.',
      en: 'An exquisite set of 2 openwork placemats woven from natural jute, complete with a bread basket. Placemat diameter: 26 cm; basket: 20 cm in diameter, 7 cm high. Materials: jute, wood. A perfect gift for lovers of handmade items.',
    },
    materials: ['джут', 'дерево'],
    colors: ['натуральний'],
    dimensions: null,
  },
  home_013: {
    name: { ua: 'Набір Ажур', en: 'Openwork set' },
    price: 1235,
    description: {
      ua: 'Набір з 4 підтарільників з ажурним плетінням з натурального джуту та хлібного кошика. Діаметр підтарільників - 26 см, розміри кошика - 20 см в діаметрі, висота - 7 см. Матеріал - джут, дерево. Чудовий подарунок для тих, хто цінує екологічне сервірування.',
      en: 'A set of 4 openwork placemats woven from natural jute, complete with a bread basket. Placemat diameter: 26 cm; basket: 20 cm in diameter, 7 cm high. Materials: jute, wood. A wonderful gift for those who value eco-friendly table setting.',
    },
    images: [IMG + 'Home-013-1.JPG', IMG + '1home.organizer.jute2.JPG', IMG + '1home.organizer.jute3.JPG'],
    materials: ['джут', 'дерево'],
    colors: ['натуральний'],
    dimensions: null,
  },
  home_007: {
    name: { ua: 'Набір До сніданку', en: 'Breakfast set' },
    price: 876,
    description: {
      ua: 'Набір в стилі етно з 2 підтарільників з візерунком соняшника і прямокутного хлібного кошика, що додасть затишної атмосфери до вашого сніданку. Матеріал: натуральний джут бежевого і чорного кольору, дерево. Діаметр підтарільників 21 см, кошик - 17/25 см, висота 6,5 см.',
      en: 'An ethno-style set of 2 placemats with a sunflower pattern and a rectangular bread basket that will bring a cozy atmosphere to your breakfast. Materials: natural jute in beige and black, wood. Placemat diameter: 21 cm; basket: 17×25 cm, 6.5 cm high.',
    },
    materials: ['джут', 'дерево'],
    colors: ['натуральний', 'чорний'],
    dimensions: null,
  },
  home_015: {
    name: { ua: 'Набір До сніданку', en: 'Breakfast set' },
    price: 1235,
    description: {
      ua: 'Набір «До сніданку» з 4 підтарільників з візерунком соняшника і прямокутного хлібного кошика. Матеріал: натуральний джут бежевого і чорного кольору, дерево. Діаметр підтарільників 21 см, кошик - 17/25 см, висота 6,5 см. Для поціновувачів екосервірування в етностилі.',
      en: 'The “Breakfast” set of 4 placemats with a sunflower pattern and a rectangular bread basket. Materials: natural jute in beige and black, wood. Placemat diameter: 21 cm; basket: 17×25 cm, 6.5 cm high. For lovers of eco-friendly table setting in ethno style.',
    },
    images: [IMG + 'Home-015-1.JPG', IMG + 'Home-015-2.JPG', IMG + '3home.organizer.jute3.JPG'],
    materials: ['джут', 'дерево'],
    colors: ['натуральний', 'чорний'],
    dimensions: null,
  },
  home_014: {
    name: { ua: 'Набір Обідній', en: 'Dinner set' },
    price: 1340,
    description: {
      ua: 'Набір для екосервірування обіднього столу з 4 підтарільників з натурального джуту і хлібного кошика. Кожен виріб, виготовлений вручну, додасть природного тепла вашому дому. Матеріал - натуральний джут, дерево. Розміри: діаметр кошика - 25 см, висота - 7 см, діаметр підтарільників - 30 см.',
      en: 'A set for eco-friendly dinner table setting: 4 natural jute placemats and a bread basket. Each handmade piece will bring natural warmth to your home. Materials: natural jute, wood. Sizes: basket 25 cm in diameter, 7 cm high; placemat diameter 30 cm.',
    },
    images: [IMG + 'Home-014-1.JPG', IMG + 'Home-014-2.JPG', IMG + 'Home-014-3.JPG'],
    materials: ['джут', 'дерево'],
    colors: ['натуральний'],
    dimensions: null,
  },
}

const NEW_PRODUCT = {
  id: 'home_027',
  category: 'home',
  name: { ua: 'Набір блакитних підтарільників', en: 'Blue placemat set' },
  description: {
    ua: 'Набір блакитних підтарільників ручної роботи з натурального джуту діаметром 28 см, в наборі 4 шт. Для яскравого акценту у сервіруванні. Чудовий подарунок для друзів.',
    en: 'A set of handmade light blue placemats made from natural jute, 28 cm in diameter, 4 pcs per set. For a bright accent in your table setting. A wonderful gift for friends.',
  },
  price: 910,
  currency: 'UAH',
  images: [IMG + 'Home-027-1.JPG', IMG + 'Home-027-2.JPG', IMG + 'Home-027-3.JPG'],
  colors: ['голубий'],
  materials: ['джут'],
  dimensions: { diameter: 28, unit: 'cm' },
  quantity: 4,
  inStock: true,
  featured: false,
  new: true,
  sku: 'HOME-027',
}

function updateJson() {
  const file = './data/products.json'
  const products = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const [id, fields] of Object.entries(UPDATES)) {
    const p = products.find(x => x.id === id)
    Object.assign(p, fields)
    if (fields.dimensions === null) delete p.dimensions
    delete p.quantity
  }
  if (!products.some(x => x.id === NEW_PRODUCT.id)) {
    const idx = products.findIndex(x => x.id === 'home_026')
    products.splice(idx + 1, 0, NEW_PRODUCT)
  }
  fs.writeFileSync(file, JSON.stringify(products, null, 2) + '\n')
  console.log('✅ data/products.json оновлено')
}

async function updateDb() {
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  for (const [id, f] of Object.entries(UPDATES)) {
    const row = {
      name_ua: f.name.ua,
      name_en: f.name.en,
      price: f.price,
      description_ua: f.description.ua,
      description_en: f.description.en,
      materials: f.materials,
      colors: f.colors,
      dimensions: f.dimensions,
    }
    if (f.images) row.images = f.images
    const { error } = await supabase.from('products').update(row).eq('id', id)
    console.log(error ? `❌ ${id}: ${error.message}` : `✅ ${id} — ${f.name.ua} оновлено`)
  }

  const p = NEW_PRODUCT
  const { error } = await supabase.from('products').upsert({
    id: p.id,
    name_ua: p.name.ua,
    name_en: p.name.en,
    sku: p.sku,
    price: p.price,
    category: p.category,
    description_ua: p.description.ua,
    description_en: p.description.en,
    images: p.images,
    colors: p.colors,
    materials: p.materials,
    dimensions: p.dimensions,
    in_stock: true,
    is_new: true,
    is_bestseller: false,
  }, { onConflict: 'id' })
  console.log(error ? `❌ ${p.id}: ${error.message}` : `✅ ${p.id} — ${p.name.ua} додано (новинка)`)
}

const mode = process.argv[2]
if (mode === 'json') updateJson()
else if (mode === 'db') updateDb().catch(console.error)
else console.log('Вкажіть режим: json або db')
