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
    'home.hero.title': 'Авторські сумки ручної роботи',
    'home.hero.subtitle': 'Поєднання етнічних мотивів та сучасного дизайну',
    'home.newArrivals': 'Нові надходження',
    'home.bestsellers': 'Хіти продажів',
    'home.collections': 'Наші колекції',
    'home.banner.title': 'Нова колекція',
    'home.banner.subtitle': 'Літо 2024',
    'home.collectionPreview.title': 'Наші колекції',
    'home.collectionPreview.subtitle': 'Виберіть свій стиль',
    'home.comingSoon': 'Скоро',
    'home.comingSoon.text': 'Незабаром тут з\'являться нові унікальні вироби',
    'home.about.title': 'Про дизайнера',
    'home.about.text': 'Кожна сумка — це історія, створена вручну з любов\'ю до деталей. Ми поєднуємо традиційні українські орнаменти з сучасними трендами, щоб ви могли виразити свою індивідуальність та підтримати вітчизняного виробника.',
    'home.about.text2': 'Наші вироби створюються з якісних матеріалів, які забезпечують довговічність та зручність у використанні. Кожна деталь продумана до дрібниць.',
    'home.about.button': 'Дізнатись більше',
    'home.banner.banner': 'Баннер',
    'home.banner.text': 'Місце для вашого оголошення',
    'home.collection.home.title': 'Home',
    'home.collection.home.description': 'Вироби для дому з натуральних матеріалів',
    'home.collection.viewCollection': 'Переглянути колекцію',
    'home.collection.comingSoon.title': 'Скоро',
    'home.collection.comingSoon.text': 'Нові колекції незабаром',

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
    'about.title': 'Про бренд knitt_lyelya',
    'about.ourStory': 'Наша історія',
    'about.story1': 'Кожна сумка — це історія, створена вручну з любов\'ю до деталей. Ми поєднуємо традиційні українські орнаменти з сучасними трендами, щоб ви могли виразити свою індивідуальність та підтримати вітчизняного виробника.',
    'about.story2': 'Наші вироби створюються з якісних матеріалів, які забезпечують довговічність та зручність у використанні. Кожна деталь продумана до дрібниць.',
    'about.values': 'Наші цінності',
    'about.value1.title': 'Якість',
    'about.value1.text': 'Використовуємо тільки найкращі матеріали та перевірені технології виробництва',
    'about.value2.title': 'Унікальність',
    'about.value2.text': 'Кожна сумка - авторська робота з унікальним дизайном та етнічними мотивами',
    'about.value3.title': 'Традиції',
    'about.value3.text': 'Підтримуємо та розвиваємо українську культуру через сучасний дизайн',
    'about.process': 'Процес створення',
    'about.process1.title': 'Дизайн',
    'about.process1.text': 'Розробка унікального дизайну з урахуванням сучасних трендів та етнічних мотивів',
    'about.process2.title': 'Вибір матеріалів',
    'about.process2.text': 'Підбір якісної натуральної шкіри, тканин та фурнітури',
    'about.process3.title': 'Ручна робота',
    'about.process3.text': 'Кожна сумка виконується вручну майстрами з багаторічним досвідом',
    'about.process4.title': 'Контроль якості',
    'about.process4.text': 'Перевірка кожної деталі перед відправкою клієнту',
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
    'home.hero.title': 'Handmade Designer Bags',
    'home.hero.subtitle': 'Merging ethnic motifs with modern design',
    'home.newArrivals': 'New Arrivals',
    'home.bestsellers': 'Bestsellers',
    'home.collections': 'Our Collections',
    'home.banner.title': 'New Collection',
    'home.banner.subtitle': 'Summer 2024',
    'home.collectionPreview.title': 'Our Collections',
    'home.collectionPreview.subtitle': 'Choose your style',
    'home.comingSoon': 'Coming Soon',
    'home.comingSoon.text': 'New unique products will appear here soon',
    'home.about.title': 'About the Designer',
    'home.about.text': 'Each bag is a story, handcrafted with love for details. We combine traditional Ukrainian ornaments with modern trends, so you can express your individuality and support local production.',
    'home.about.text2': 'Our products are made from quality materials that ensure durability and ease of use. Every detail is thoughtfully crafted.',
    'home.about.button': 'Learn More',
    'home.banner.banner': 'Banner',
    'home.banner.text': 'Place for your announcement',
    'home.collection.home.title': 'Home',
    'home.collection.home.description': 'Home products made from natural materials',
    'home.collection.viewCollection': 'View collection',
    'home.collection.comingSoon.title': 'Coming Soon',
    'home.collection.comingSoon.text': 'New collections coming soon',

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
    'about.title': 'About knitt_lyelya brand',
    'about.ourStory': 'Our Story',
    'about.story1': 'Each bag is a story, handcrafted with love for details. We combine traditional Ukrainian ornaments with modern trends, so you can express your individuality and support local production.',
    'about.story2': 'Our products are made from quality materials that ensure durability and ease of use. Every detail is thoughtfully crafted.',
    'about.values': 'Our Values',
    'about.value1.title': 'Quality',
    'about.value1.text': 'We use only the best materials and proven production technologies',
    'about.value2.title': 'Uniqueness',
    'about.value2.text': 'Each bag is an author\'s work with unique design and ethnic motifs',
    'about.value3.title': 'Traditions',
    'about.value3.text': 'We support and develop Ukrainian culture through modern design',
    'about.process': 'Creation Process',
    'about.process1.title': 'Design',
    'about.process1.text': 'Development of unique design considering modern trends and ethnic motifs',
    'about.process2.title': 'Material Selection',
    'about.process2.text': 'Selection of quality natural leather, fabrics and fittings',
    'about.process3.title': 'Handmade',
    'about.process3.text': 'Each bag is handmade by craftsmen with years of experience',
    'about.process4.title': 'Quality Control',
    'about.process4.text': 'Checking every detail before shipping to the customer',
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
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ua')

  useEffect(() => {
    // Load language from localStorage on client side
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'ua' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
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
