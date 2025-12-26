# Приклади використання Sanity

## Отримання товарів на сторінці

### Каталог товарів

```typescript
// app/catalog/[category]/page.tsx
import { getProductsByCategory } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'

export default async function CatalogPage({
  params
}: {
  params: { category: string }
}) {
  const products = await getProductsByCategory(params.category)

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product._id}>
          {product.images && (
            <img
              src={urlFor(product.images[0]).width(400).url()}
              alt={product.name_ua}
            />
          )}
          <h3>{product.name_ua}</h3>
          <p>{product.price} грн</p>
        </div>
      ))}
    </div>
  )
}
```

### Сторінка товару

```typescript
// app/product/[slug]/page.tsx
import { getProductBySlug } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'

export default async function ProductPage({
  params
}: {
  params: { slug: string }
}) {
  const product = await getProductBySlug(params.slug)

  return (
    <div>
      <h1>{product.name_ua}</h1>
      <p>{product.description_ua}</p>
      <p>Ціна: {product.price} грн</p>

      <div className="images">
        {product.images.map((image, index) => (
          <img
            key={index}
            src={urlFor(image).width(600).url()}
            alt={`${product.name_ua} ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
```

### Головна сторінка - Нові товари

```typescript
// app/page.tsx
import { client } from '@/lib/sanity'

export default async function HomePage() {
  const newProducts = await client.fetch(`
    *[_type == "product" && isNew == true] | order(_createdAt desc) [0...6] {
      _id,
      name_ua,
      name_en,
      slug,
      price,
      images
    }
  `)

  return (
    <section>
      <h2>Нові надходження</h2>
      <div className="grid">
        {newProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}
```

## Робота з зображеннями

```typescript
import { urlFor } from '@/lib/sanity'

// Оригінальний розмір
<img src={urlFor(image).url()} />

// Конкретний розмір
<img src={urlFor(image).width(400).height(300).url()} />

// З blur placeholder
<img
  src={urlFor(image).width(400).url()}
  placeholder="blur"
  blurDataURL={urlFor(image).width(50).blur(50).url()}
/>

// Якість зображення
<img src={urlFor(image).width(400).quality(80).url()} />
```

## Пошук товарів

```typescript
const searchResults = await client.fetch(`
  *[_type == "product" && (
    name_ua match $query ||
    name_en match $query ||
    sku match $query
  )] {
    _id,
    name_ua,
    slug,
    price,
    images
  }
`, { query: `*${searchTerm}*` })
```

## Фільтрація

```typescript
// Товари в наявності
const inStockProducts = await client.fetch(`
  *[_type == "product" && inStock == true]
`)

// Товари зі знижкою
const saleProducts = await client.fetch(`
  *[_type == "product" && discount > 0]
`)

// Товари по ціні
const affordableProducts = await client.fetch(`
  *[_type == "product" && price <= 1500]
`)
```
