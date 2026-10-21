// Нові товари розділу ДІМ (жовтень 2026, частина 2): HOME-028 — HOME-032, набори підставок з джуту
// Фото кладемо в public/images/products як Home-028-1.JPG, Home-028-2.JPG ... — скрипт підхоплює їх сам
// Запуск:
//   node update-october2-2026.js json  — оновити data/products.json
//   node update-october2-2026.js db    — оновити Supabase (після деплою фото!)
require('dotenv').config({ path: '.env.local', quiet: true })
const fs = require('fs')

const IMG = '/images/products/'
const IMG_DIR = './public/images/products'

const NEW_PRODUCTS = [
  {
    id: 'home_028',
    name: { ua: 'Набір Мереживний', en: 'Lacy' },
    description: {
      ua: 'Набір Мереживний ручної роботи з натурального джуту. Велика серветка діаметром 26 см та 4 підставки під чашки діаметром 13 см. Настрій мережива ручної роботи створює затишок вашої ранкової кави. Матеріал - джут, колір - натурального джуту.',
      en: 'The handmade Lacy set made from natural jute: a large placemat 26 cm in diameter and 4 cup coasters 13 cm in diameter. The charm of handmade lace brings coziness to your morning coffee. Material: jute; colour: natural jute.',
    },
    price: 520,
    colors: ['натуральний'],
  },
  {
    id: 'home_029',
    name: { ua: 'Набір Мальва', en: 'Mallow' },
    description: {
      ua: 'Набір Мальва ручної роботи з натурального джуту. Велика серветка діаметром 30 см та 4 підставки під чашки діаметром 12 см. Квітковий орнамент мальви підкреслює характер українського сервірування. Матеріал - джут, кольори - натурального джуту, червоний, зелений. Хороша ідея для подарунку.',
      en: 'The handmade Mallow set made from natural jute: a large placemat 30 cm in diameter and 4 cup coasters 12 cm in diameter. The floral mallow pattern highlights the character of Ukrainian table setting. Material: jute; colours: natural, red, green. A great gift idea.',
    },
    price: 520,
    colors: ['натуральний', 'червоний', 'зелений'],
  },
  {
    id: 'home_030',
    name: { ua: 'Набір Барвінковий', en: 'Vinca' },
    description: {
      ua: 'Набір Барвінковий ручної роботи з натурального джуту - 4 підставки під чашки діаметром 13 см. Блакитний барвінок, як символ вічності, життєвої сили і вічного кохання, створює приємний настрій чайної церемонії. Матеріал - джут, кольори - натурального джуту, блакитний, чорний.',
      en: 'The handmade Vinca set made from natural jute: 4 cup coasters 13 cm in diameter. Blue periwinkle, a symbol of eternity, vitality and everlasting love, sets a pleasant mood for your tea ceremony. Material: jute; colours: natural, blue, black.',
    },
    price: 430,
    colors: ['натуральний', 'голубий', 'чорний'],
  },
  {
    id: 'home_031',
    name: { ua: 'Набір Квітковий', en: 'Flowery' },
    description: {
      ua: 'Підставки під чашки з яскравою помаранчевою квіткою, діаметр - 13 см, з натурального джуту, ручної роботи, в наборі - 4 шт. Теплий колір додає сонячної атмосфери чайної або кавової церемонії в колі сімʼї. Матеріал - джут, кольори - натурального джуту, помаранчевий, чорний.',
      en: 'Handmade natural jute cup coasters with a bright orange flower, 13 cm in diameter, 4 pcs per set. The warm colour adds a sunny atmosphere to a family tea or coffee ceremony. Material: jute; colours: natural, orange, black.',
    },
    price: 450,
    colors: ['натуральний', 'помаранчевий', 'чорний'],
  },
  {
    id: 'home_032',
    name: { ua: 'Набір Червона рута', en: 'Red rue' },
    description: {
      ua: 'Яскравий набір з натурального джуту ручної роботи. Підставка під чайний заварник діаметром 20 см та 4 підставки під чашки діаметром 12 см. Квітковий орнамент рути надає характер етнічного дизайну в сервіруванні вашого столу. Матеріал - джут, кольори - натурального джуту, червоний, чорний. Хороша ідея для подарунку.',
      en: 'A bright handmade set made from natural jute: a teapot stand 20 cm in diameter and 4 cup coasters 12 cm in diameter. The floral rue pattern adds an ethnic touch to your table setting. Material: jute; colours: natural, red, black. A great gift idea.',
    },
    price: 550,
    colors: ['натуральний', 'червоний', 'чорний'],
  },
]

// Фото товару: Home-028-1.JPG, Home-028-2.JPG ... у порядку номерів
function imagesFor(id) {
  const prefix = 'Home-' + id.split('_')[1] + '-'
  return fs.readdirSync(IMG_DIR)
    .filter(f => f.startsWith(prefix))
    .sort((a, b) => parseInt(a.slice(prefix.length)) - parseInt(b.slice(prefix.length)))
    .map(f => IMG + f)
}

function buildProduct(p) {
  const images = imagesFor(p.id)
  if (!images.length) throw new Error(`Немає фото для ${p.id} у ${IMG_DIR}`)
  return {
    id: p.id,
    category: 'home',
    name: p.name,
    description: p.description,
    price: p.price,
    currency: 'UAH',
    images,
    colors: p.colors,
    materials: ['джут'],
    inStock: true,
    featured: false,
    new: true,
    sku: 'HOME-' + p.id.split('_')[1],
  }
}

function updateJson() {
  const file = './data/products.json'
  const products = JSON.parse(fs.readFileSync(file, 'utf8'))
  let after = products.findIndex(x => x.id === 'home_027')
  for (const p of NEW_PRODUCTS) {
    const product = buildProduct(p)
    const existing = products.findIndex(x => x.id === p.id)
    if (existing !== -1) {
      products[existing] = product
      after = existing
    } else {
      products.splice(++after, 0, product)
    }
    console.log(`✅ ${p.id} — ${p.name.ua} (${product.images.length} фото)`)
  }
  fs.writeFileSync(file, JSON.stringify(products, null, 2) + '\n')
  console.log('✅ data/products.json оновлено')
}

async function updateDb() {
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  for (const raw of NEW_PRODUCTS) {
    const p = buildProduct(raw)
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
      dimensions: null,
      in_stock: true,
      is_new: true,
      is_bestseller: false,
    }, { onConflict: 'id' })
    console.log(error ? `❌ ${p.id}: ${error.message}` : `✅ ${p.id} — ${p.name.ua} додано (новинка)`)
  }
}

const mode = process.argv[2]
if (mode === 'json') updateJson()
else if (mode === 'db') updateDb().catch(console.error)
else console.log('Вкажіть режим: json або db')
