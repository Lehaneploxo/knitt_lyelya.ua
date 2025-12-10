'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'ua' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  ua: {
    // Header
    'nav.ethno': 'Етно',
    'nav.basic': 'Базові',
    'nav.home': 'Дім',
    'nav.about': 'Про бренд',
    'nav.contacts': 'Контакти',

    // Common
    'common.addToCart': 'Додати в кошик',
    'common.cart': 'Кошик',
    'common.viewCatalog': 'Переглянути каталог',
    'common.viewAll': 'Дивитись все',
    'common.continueShopping': 'Продовжити покупки',
    'common.checkout': 'Оформити замовлення',
    'common.currency': 'грн',
    'common.addedToCart': 'Товар додано в кошик',
    'common.home': 'Головна',
    'common.catalog': 'Каталог',

    // Home page
    'home.hero.title': 'Авторські сумки та домашній декор ручної роботи',
    'home.hero.subtitle': 'ПОЄДНАННЯ ЕТНІЧНИХ МОТИВІВ ТА СУЧАСНОГО ДИЗАЙНУ',
    'home.newArrivals': 'Нові надходження',
    'home.bestsellers': 'Хіти продажів',
    'home.collections': 'Наші колекції',
    'home.banner.title': 'Нова колекція',
    'home.banner.subtitle': 'Літо 2024',
    'home.collectionPreview.title': 'Наші колекції',
    'home.collectionPreview.subtitle': 'Виберіть свій стиль',
    'home.comingSoon': 'Скоро',
    'home.comingSoon.text': 'Незабаром тут з\'являться нові унікальні вироби',
    'home.about.title': 'Про бренд',
    'home.about.text': 'Knitt.lyelya.ua — це поєднання природної елегантності, ручної майстерності та етнічної автентичності. Ми створюємо сумки та предмети домашнього декору з екологічних матеріалів: якісного міцного джуту, бавовняного шнура з додаванням шкіряних деталей. Кожен виріб, виготовлений вручну, є унікальним та наповненим характером. У своїх дизайнах ми поєднуємо сучасну лаконічність із традиційними етнічними мотивами. Це додає виробам душевності та індивідуальності, робить їх не лише функціональними, а й естетично виразними.',
    'home.about.text2': 'Наші вироби гармонійно поєднують стиль, екологічність і майстерність. Наші сумки та елементи декору — це більше, ніж аксесуари та предмети інтер\'єру, це історія, яку ви можете носити з собою або створювати у своєму домі.',
    'home.about.button': 'Дізнатись більше',
    'home.banner.banner': 'Баннер',
    'home.banner.text': 'Місце для вашого оголошення',
    'home.collection.ethno.title': 'Етно',
    'home.collection.ethno.description': 'Авторські сумки з етнічними орнаментами',
    'home.collection.basic.title': 'Базові',
    'home.collection.basic.description': 'Класичні моделі на кожен день',
    'home.collection.home.title': 'Дім',
    'home.collection.home.description': 'Вироби для дому з натуральних матеріалів',
    'home.collection.viewMore': 'Дивитись більше',
    'home.instagram.title': 'Слідкуйте за нами в Instagram',
    'home.instagram.subtitle': 'Дивіться наші останні роботи та закулісся створення виробів',

    // Product page
    'product.notFound': 'Товар не знайдено',
    'product.returnToCatalog': 'Повернутися до каталогу',
    'product.sku': 'Артикул',
    'product.addedToCart': 'товар(ів) додано в кошик',
    'product.description': 'Опис товару',
    'product.color': 'Колір',
    'product.quantity': 'Кількість',
    'product.inStock': 'В наявності',
    'product.outOfStock': 'Немає в наявності',
    'product.tab.description': 'Опис',
    'product.tab.specifications': 'Характеристики',
    'product.tab.delivery': 'Доставка',
    'product.handmade.text': 'Кожен виріб виконаний вручну з дотриманням традиційних технологій та з використанням сучасних матеріалів високої якості.',
    'product.materials.label': 'Матеріали',
    'product.dimensions.label': 'Розміри',
    'product.quantity.set': 'Кількість в наборі',
    'product.quantity.pcs': 'шт',
    'product.delivery.ukrposhta.title': 'Укрпошта',
    'product.delivery.ukrposhta.text': 'Доставка по Україні 3-7 днів. Вартість: від 50 грн',
    'product.delivery.novaposhta.title': 'Нова Пошта',
    'product.delivery.novaposhta.text': 'Доставка 1-3 дні. Вартість: за тарифами перевізника',
    'product.delivery.payment.title': 'Оплата',
    'product.delivery.payment.text': 'Оплата при отриманні (накладений платіж) або онлайн карткою',

    // Catalog page
    'catalog.filters.all': 'Всі',
    'catalog.filters.inStock': 'В наявності',
    'catalog.filters.new': 'Нові',
    'catalog.filters.bestsellers': 'Хіти продажів',
    'catalog.productsFound': 'Знайдено товарів',
    'catalog.noProducts': 'В цій категорії поки немає товарів',
    'catalog.ethno.title': 'Етно сумки',
    'catalog.ethno.description': 'Авторські сумки з етнічними орнаментами',
    'catalog.basic.title': 'Базові сумки',
    'catalog.basic.description': 'Класичні моделі на кожен день',
    'catalog.home.title': 'Товари для дому',
    'catalog.home.description': 'Декоративні вироби ручної роботи',

    // Cart page
    'cart.empty.title': 'Ваш кошик порожній',
    'cart.empty.description': 'Додайте товари до кошика, щоб продовжити покупки',
    'cart.empty.button': 'Повернутись до покупок',
    'cart.title': 'Кошик',
    'cart.color': 'Колір',
    'cart.total': 'Разом',
    'cart.subtotal': 'Сума товарів:',
    'cart.delivery': 'Доставка:',
    'cart.deliveryCalculated': 'Розраховується при оформленні',
    'cart.totalToPay': 'Всього до оплати:',

    // Checkout page
    'checkout.title': 'Оформлення замовлення',
    'checkout.contactInfo': '1. Контактна інформація',
    'checkout.firstName': 'Ім\'я',
    'checkout.lastName': 'Прізвище',
    'checkout.phone': 'Телефон',
    'checkout.email': 'Email',
    'checkout.delivery': '2. Доставка',
    'checkout.deliveryUkrposhta': 'Укрпошта',
    'checkout.deliveryUkrposhtaTime': 'Доставка 3-7 днів',
    'checkout.deliveryNovaposhta': 'Нова Пошта',
    'checkout.deliveryNovaposhtaTime': 'Доставка 1-3 дні',
    'checkout.city': 'Місто',
    'checkout.address': 'Відділення / Адреса',
    'checkout.payment': '3. Оплата',
    'checkout.paymentCash': 'Оплата при отриманні',
    'checkout.paymentCashDescription': 'Накладений платіж',
    'checkout.paymentCard': 'Оплата карткою онлайн',
    'checkout.paymentCardDescription': 'LiqPay (Visa, Mastercard)',
    'checkout.comment': '4. Коментар',
    'checkout.commentPlaceholder': 'Додаткові побажання до замовлення (опціонально)',
    'checkout.yourOrder': 'Ваше замовлення',
    'checkout.deliveryFrom': 'Від 50 грн',
    'checkout.total': 'Всього:',
    'checkout.submit': 'Підтвердити замовлення',
    'checkout.submitting': 'Оформлення...',
    'checkout.errorRequired': 'Заповніть всі обов\'язкові поля',
    'checkout.success': 'Замовлення успішно оформлено!',
    'checkout.error': 'Помилка при оформленні замовлення',

    // Order success page
    'orderSuccess.title': 'Дякуємо за замовлення!',
    'orderSuccess.orderNumber': 'Ваше замовлення',
    'orderSuccess.success': 'успішно оформлено',
    'orderSuccess.emailSent': 'Ми надіслали підтвердження на вказану електронну адресу',
    'orderSuccess.whatNext': 'Що далі?',
    'orderSuccess.step1': 'Наш менеджер зв\'яжеться з вами протягом 1-2 годин для підтвердження замовлення',
    'orderSuccess.step2': 'Ми відправимо ваше замовлення обраною службою доставки',
    'orderSuccess.step3': 'Ви отримаєте номер для відстеження посилки',
    'orderSuccess.step4': 'Очікуйте доставку протягом 1-7 днів (в залежності від служби доставки)',
    'orderSuccess.backHome': 'Повернутись на головну',
    'orderSuccess.continueShopping': 'Продовжити покупки',
    'orderSuccess.contactUs': 'Якщо у вас виникли питання, зв\'яжіться з нами:',

    // About page
    'about.title': 'Про бренд Knitt.lyelya.ua',
    'about.ourStory': 'Про нас',
    'about.story1': 'Knitt.lyelya.ua — це поєднання природної елегантності, ручної майстерності та етнічної автентичності.',
    'about.story2': 'Ми створюємо сумки та предмети домашнього декору з екологічних матеріалів: якісного міцного джуту, бавовняного шнура з додаванням шкіряних деталей. Кожен виріб, виготовлений вручну, є унікальним та наповненим характером. У своїх дизайнах ми поєднуємо сучасну лаконічність із традиційними етнічними мотивами. Це додає виробам душевності та індивідуальності, робить їх не лише функціональними, а й естетично виразними.',
    'about.story3': 'Наші вироби гармонійно поєднують стиль, екологічність і майстерність. Наші сумки та елементи декору — це більше, ніж аксесуари та предмети інтер\'єру, це історія, яку ви можете носити з собою або створювати у своєму домі.',
    'about.values': 'Наші цінності',
    'about.value1.title': 'Якість та Екологічність',
    'about.value1.text': 'Ми використовуємо тільки найкращі натуральні та екологічні матеріали та перевірені технології виробництва.',
    'about.value2.title': 'Ручна робота',
    'about.value2.text': 'Кожна сумка, аксесуар проходить шлях від ідеї до готового виробу виключно вручну, з увагою до деталей.',
    'about.value3.title': 'Традиції',
    'about.value3.text': 'Поєднуємо традиційні українські орнаменти з сучасними трендами, створюємо індивідуальний стиль ваших щоденних аксесуарів.',
    'about.value4.title': 'Унікальність',
    'about.value4.text': 'Кожен наш аксесуар - авторська робота з унікальним дизайном та етнічними мотивами. Жоден виріб не повторюється на 100%.',
    'about.mission': 'Місія бренду',
    'about.missionText': 'Наша місія — зберігати та популяризувати українську культуру через сучасні аксесуари, які можна носити щодня.',
    'about.cta.title': 'Готові обрати свою сумку?',
    'about.cta.subtitle': 'Перегляньте нашу колекцію авторських сумок ручної роботи',
    'about.cta.button': 'Переглянути колекції',

    // Contacts page
    'contacts.title': 'Контакти',
    'contacts.subtitle': 'Зв\'яжіться з нами будь-яким зручним способом',
    'contacts.writeUs': 'Напишіть нам',
    'contacts.name': 'Ім\'я',
    'contacts.namePlaceholder': 'Ваше ім\'я',
    'contacts.email': 'Email',
    'contacts.emailPlaceholder': 'your@email.com',
    'contacts.message': 'Повідомлення',
    'contacts.messagePlaceholder': 'Ваше повідомлення...',
    'contacts.send': 'Надіслати повідомлення',
    'contacts.info': 'Контактна інформація',
    'contacts.phone': 'Телефон',
    'contacts.phoneAlso': 'Також Telegram та WhatsApp',
    'contacts.emailTitle': 'Email',
    'contacts.emailResponse': 'Відповімо протягом 24 годин',
    'contacts.address': 'Адреса',
    'contacts.addressCity': 'м. Київ, Україна',
    'contacts.addressDelivery': 'Доставка по всій Україні',
    'contacts.social': 'Соціальні мережі',
    'contacts.schedule': 'Графік роботи',
    'contacts.scheduleWeekdays': 'Понеділок - П\'ятниця: 10:00 - 18:00',
    'contacts.scheduleWeekend': 'Субота - Неділя: Вихідний',
    'contacts.errorFillAll': 'Заповніть всі поля',
    'contacts.success': 'Повідомлення надіслано! Ми зв\'яжемось з вами найближчим часом.',

    // Footer
    'footer.description': 'Авторські сумки ручної роботи. Поєднання етнічних мотивів та сучасного дизайну.',
    'footer.contacts': 'Контакти',
    'footer.phone': 'Телефон',
    'footer.email': 'Email',
    'footer.schedule': 'Пн-Пт: 10:00 - 18:00',
    'footer.social': 'Соціальні мережі',
    'footer.rights': 'Всі права захищені.',
    'footer.privacy': 'Політика конфіденційності',
    'footer.terms': 'Договір оферти',

    // Header toast
    'header.languageChanged.ua': 'Мова змінена на українську',
    'header.languageChanged.en': 'Language changed to English',

    // Colors
    'color.натуральний': 'натуральний',
    'color.чорний': 'чорний',
    'color.голубий': 'голубий',
    'color.молочний': 'молочний',
    'color.червоний': 'червоний',
    'color.зелений': 'зелений',
    'color.синій': 'синій',
    'color.темно-синій': 'темно-синій',
    'color.коричневий': 'коричневий',
    'color.білий': 'білий',
    'color.жовтий': 'жовтий',
    'color.помаранчевий': 'помаранчевий',
    'color.рожевий': 'рожевий',
    'color.фіолетовий': 'фіолетовий',
    'color.сірий': 'сірий',
    'color.бежевий': 'бежевий',
    'color.пастельно-коричневий': 'пастельно-коричневий',
    'color.мокко': 'мокко',
    'color.капучіно': 'капучіно',
    'color.антрацит': 'антрацит',
    'color.графіт': 'графіт',
    'color.льон': 'льон',
    'color.айворі': 'айворі',
    'color.теракот': 'теракот',
    'color.тополя': 'тополя',
    'color.синя лагуна': 'синя лагуна',

    // Materials
    'material.джут': 'джут',
    'material.шкіряний шнур': 'шкіряний шнур',
    'material.дерево': 'дерево',
    'material.бавовняний шнур': 'бавовняний шнур',
    'material.шкіра': 'шкіра',
  },
  en: {
    // Header
    'nav.ethno': 'Ethno',
    'nav.basic': 'Basic',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contacts': 'Contacts',

    // Common
    'common.addToCart': 'Add to Cart',
    'common.cart': 'Cart',
    'common.viewCatalog': 'View Catalog',
    'common.viewAll': 'View All',
    'common.continueShopping': 'Continue Shopping',
    'common.checkout': 'Checkout',
    'common.currency': 'UAH',
    'common.addedToCart': 'Product added to cart',
    'common.home': 'Home',
    'common.catalog': 'Catalog',

    // Home page
    'home.hero.title': 'Handmade Bags and Home Decor',
    'home.hero.subtitle': 'MERGING ETHNIC MOTIFS WITH MODERN DESIGN',
    'home.newArrivals': 'New Arrivals',
    'home.bestsellers': 'Bestsellers',
    'home.collections': 'Our Collections',
    'home.banner.title': 'New Collection',
    'home.banner.subtitle': 'Summer 2024',
    'home.collectionPreview.title': 'Our Collections',
    'home.collectionPreview.subtitle': 'Choose your style',
    'home.comingSoon': 'Coming Soon',
    'home.comingSoon.text': 'New unique products will appear here soon',
    'home.about.title': 'About the Brand',
    'home.about.text': 'Knitt.lyelya.ua is a blend of natural elegance, handcrafted artistry, and ethnic authenticity. We create bags and home décor items from eco-friendly materials: high-quality sturdy jute, cotton cord with leather accents. Each product, handmade, is unique and filled with character. In our designs, we combine modern minimalism with traditional ethnic motifs. This adds warmth and individuality to our products, making them not only functional but also aesthetically expressive.',
    'home.about.text2': 'Our products harmoniously combine style, eco-friendliness, and craftsmanship. Our bags and décor elements are more than just accessories and interior items; they are a story you can carry with you or create in your home.',
    'home.about.button': 'Learn More',
    'home.banner.banner': 'Banner',
    'home.banner.text': 'Place for your announcement',
    'home.collection.ethno.title': 'Ethno',
    'home.collection.ethno.description': 'Designer bags with ethnic ornaments',
    'home.collection.basic.title': 'Basic',
    'home.collection.basic.description': 'Classic models for everyday use',
    'home.collection.home.title': 'Home',
    'home.collection.home.description': 'Home products made from natural materials',
    'home.collection.viewMore': 'View more',
    'home.instagram.title': 'Follow us on Instagram',
    'home.instagram.subtitle': 'See our latest works and behind-the-scenes of product creation',

    // Product page
    'product.notFound': 'Product not found',
    'product.returnToCatalog': 'Return to catalog',
    'product.sku': 'SKU',
    'product.addedToCart': 'item(s) added to cart',
    'product.description': 'Product Description',
    'product.color': 'Color',
    'product.quantity': 'Quantity',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.tab.description': 'Description',
    'product.tab.specifications': 'Specifications',
    'product.tab.delivery': 'Delivery',
    'product.handmade.text': 'Each product is handmade following traditional techniques and using high-quality modern materials.',
    'product.materials.label': 'Materials',
    'product.dimensions.label': 'Dimensions',
    'product.quantity.set': 'Set quantity',
    'product.quantity.pcs': 'pcs',
    'product.delivery.ukrposhta.title': 'Ukrposhta',
    'product.delivery.ukrposhta.text': 'Delivery across Ukraine 3-7 days. Cost: from 50 UAH',
    'product.delivery.novaposhta.title': 'Nova Poshta',
    'product.delivery.novaposhta.text': 'Delivery 1-3 days. Cost: according to carrier tariffs',
    'product.delivery.payment.title': 'Payment',
    'product.delivery.payment.text': 'Cash on delivery or online card payment',

    // Catalog page
    'catalog.filters.all': 'All',
    'catalog.filters.inStock': 'In Stock',
    'catalog.filters.new': 'New',
    'catalog.filters.bestsellers': 'Bestsellers',
    'catalog.productsFound': 'Products found',
    'catalog.noProducts': 'No products in this category yet',
    'catalog.ethno.title': 'Ethno Bags',
    'catalog.ethno.description': 'Designer bags with ethnic ornaments',
    'catalog.basic.title': 'Basic Bags',
    'catalog.basic.description': 'Classic models for everyday use',
    'catalog.home.title': 'Home Products',
    'catalog.home.description': 'Handmade decorative products',

    // Cart page
    'cart.empty.title': 'Your cart is empty',
    'cart.empty.description': 'Add items to cart to continue shopping',
    'cart.empty.button': 'Back to shopping',
    'cart.title': 'Cart',
    'cart.color': 'Color',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal:',
    'cart.delivery': 'Delivery:',
    'cart.deliveryCalculated': 'Calculated at checkout',
    'cart.totalToPay': 'Total to pay:',

    // Checkout page
    'checkout.title': 'Checkout',
    'checkout.contactInfo': '1. Contact Information',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.phone': 'Phone',
    'checkout.email': 'Email',
    'checkout.delivery': '2. Delivery',
    'checkout.deliveryUkrposhta': 'Ukrposhta',
    'checkout.deliveryUkrposhtaTime': 'Delivery 3-7 days',
    'checkout.deliveryNovaposhta': 'Nova Poshta',
    'checkout.deliveryNovaposhtaTime': 'Delivery 1-3 days',
    'checkout.city': 'City',
    'checkout.address': 'Office / Address',
    'checkout.payment': '3. Payment',
    'checkout.paymentCash': 'Cash on delivery',
    'checkout.paymentCashDescription': 'Payment on delivery',
    'checkout.paymentCard': 'Online card payment',
    'checkout.paymentCardDescription': 'LiqPay (Visa, Mastercard)',
    'checkout.comment': '4. Comment',
    'checkout.commentPlaceholder': 'Additional wishes for the order (optional)',
    'checkout.yourOrder': 'Your Order',
    'checkout.deliveryFrom': 'From 50 UAH',
    'checkout.total': 'Total:',
    'checkout.submit': 'Confirm Order',
    'checkout.submitting': 'Processing...',
    'checkout.errorRequired': 'Please fill in all required fields',
    'checkout.success': 'Order successfully placed!',
    'checkout.error': 'Error placing order',

    // Order success page
    'orderSuccess.title': 'Thank you for your order!',
    'orderSuccess.orderNumber': 'Your order',
    'orderSuccess.success': 'successfully placed',
    'orderSuccess.emailSent': 'We have sent confirmation to your email address',
    'orderSuccess.whatNext': 'What\'s next?',
    'orderSuccess.step1': 'Our manager will contact you within 1-2 hours to confirm the order',
    'orderSuccess.step2': 'We will ship your order via the selected delivery service',
    'orderSuccess.step3': 'You will receive a tracking number',
    'orderSuccess.step4': 'Expect delivery within 1-7 days (depending on delivery service)',
    'orderSuccess.backHome': 'Back to home',
    'orderSuccess.continueShopping': 'Continue shopping',
    'orderSuccess.contactUs': 'If you have any questions, contact us:',

    // About page
    'about.title': 'About Knitt.lyelya.ua Brand',
    'about.ourStory': 'About Us',
    'about.story1': 'Knitt.lyelya.ua is a blend of natural elegance, handcrafted artistry, and ethnic authenticity.',
    'about.story2': 'We create bags and home décor items from eco-friendly materials: high-quality sturdy jute, cotton cord with leather accents. Each product, handmade, is unique and filled with character. In our designs, we combine modern minimalism with traditional ethnic motifs. This adds warmth and individuality to our products, making them not only functional but also aesthetically expressive.',
    'about.story3': 'Our products harmoniously combine style, eco-friendliness, and craftsmanship. Our bags and décor elements are more than just accessories and interior items; they are a story you can carry with you or create in your home.',
    'about.values': 'Our Values',
    'about.value1.title': 'Quality and Eco-friendliness',
    'about.value1.text': 'We use only the finest natural and eco-friendly materials and proven production technologies.',
    'about.value2.title': 'Handmade',
    'about.value2.text': 'Each bag and accessory goes through the journey from idea to finished product exclusively by hand, with attention to detail.',
    'about.value3.title': 'Traditions',
    'about.value3.text': 'We combine traditional Ukrainian ornaments with modern trends, creating an individual style for your everyday accessories.',
    'about.value4.title': 'Uniqueness',
    'about.value4.text': 'Each of our accessories is an author\'s work with unique design and ethnic motifs. No product is 100% identical.',
    'about.mission': 'Brand Mission',
    'about.missionText': 'Our mission is to preserve and popularize Ukrainian culture through modern accessories that can be worn every day.',
    'about.cta.title': 'Ready to choose your bag?',
    'about.cta.subtitle': 'Browse our collection of handmade designer bags',
    'about.cta.button': 'View Collections',

    // Contacts page
    'contacts.title': 'Contacts',
    'contacts.subtitle': 'Contact us in any convenient way',
    'contacts.writeUs': 'Write to us',
    'contacts.name': 'Name',
    'contacts.namePlaceholder': 'Your name',
    'contacts.email': 'Email',
    'contacts.emailPlaceholder': 'your@email.com',
    'contacts.message': 'Message',
    'contacts.messagePlaceholder': 'Your message...',
    'contacts.send': 'Send message',
    'contacts.info': 'Contact Information',
    'contacts.phone': 'Phone',
    'contacts.phoneAlso': 'Also Telegram and WhatsApp',
    'contacts.emailTitle': 'Email',
    'contacts.emailResponse': 'We\'ll respond within 24 hours',
    'contacts.address': 'Address',
    'contacts.addressCity': 'Kyiv, Ukraine',
    'contacts.addressDelivery': 'Delivery throughout Ukraine',
    'contacts.social': 'Social Media',
    'contacts.schedule': 'Working Hours',
    'contacts.scheduleWeekdays': 'Monday - Friday: 10:00 - 18:00',
    'contacts.scheduleWeekend': 'Saturday - Sunday: Closed',
    'contacts.errorFillAll': 'Please fill in all fields',
    'contacts.success': 'Message sent! We will contact you soon.',

    // Footer
    'footer.description': 'Handmade designer bags. Merging ethnic motifs with modern design.',
    'footer.contacts': 'Contacts',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'footer.schedule': 'Mon-Fri: 10:00 - 18:00',
    'footer.social': 'Social Media',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',

    // Header toast
    'header.languageChanged.ua': 'Мова змінена на українську',
    'header.languageChanged.en': 'Language changed to English',

    // Colors
    'color.натуральний': 'Natural',
    'color.чорний': 'Black',
    'color.голубий': 'Light Blue',
    'color.молочний': 'Cream',
    'color.червоний': 'Red',
    'color.зелений': 'Green',
    'color.синій': 'Blue',
    'color.темно-синій': 'Dark Blue',
    'color.коричневий': 'Brown',
    'color.білий': 'White',
    'color.жовтий': 'Yellow',
    'color.помаранчевий': 'Orange',
    'color.рожевий': 'Pink',
    'color.фіолетовий': 'Purple',
    'color.сірий': 'Gray',
    'color.бежевий': 'Beige',
    'color.пастельно-коричневий': 'Pastel Brown',
    'color.мокко': 'Mocha',
    'color.капучіно': 'Cappuccino',
    'color.антрацит': 'Anthracite',
    'color.графіт': 'Graphite',
    'color.льон': 'Linen',
    'color.айворі': 'Ivory',
    'color.теракот': 'Terracotta',
    'color.тополя': 'Poplar',
    'color.синя лагуна': 'Blue Lagoon',

    // Materials
    'material.джут': 'jute',
    'material.шкіряний шнур': 'leather cord',
    'material.дерево': 'wood',
    'material.бавовняний шнур': 'cotton cord',
    'material.шкіра': 'leather',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ua')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load language from localStorage on client side
    try {
      const saved = localStorage.getItem('language') as Language
      if (saved && (saved === 'ua' || saved === 'en')) {
        setLanguageState(saved)
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang)
      } catch (error) {
        console.error('Error saving language to localStorage:', error)
      }
    }
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
