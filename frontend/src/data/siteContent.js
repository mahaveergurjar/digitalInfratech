// Image imports commented out - files don't exist yet
// Placeholder values used instead to allow app to run
// TODO: Add these images to frontend/src/assets/digitalinfratech/

// import categoryStripImage from '../assets/digitalinfratech/category-strip.png';
const categoryStripImage = '';

// Paint Product Images
// import birlaWallCare from '../assets/digitalinfratech/birla-wallcare-putty.png';
const birlaWallCare = '';
// import asianAcrylicPutty from '../assets/digitalinfratech/asian-acrylic-putty.png';
const asianAcrylicPutty = '';
// import asianInteriorPrimer from '../assets/digitalinfratech/asian-interior-primer.png';
const asianInteriorPrimer = '';
// import birlaActivcoatPrimer from '../assets/digitalinfratech/birla-activcoat-primer.png';
const birlaActivcoatPrimer = '';
// import asianWoodPrimer from '../assets/digitalinfratech/asian-wood-primer.png';
const asianWoodPrimer = '';
// import brushSet from '../assets/digitalinfratech/brush-set.png';
const brushSet = '';
// import sandpaperSheet from '../assets/digitalinfratech/sandpaper-sheet.png';
const sandpaperSheet = '';

// import servicePainting from '../assets/service-painting.png';
const servicePainting = '';

export const brand = {
  name: 'Digital InfraTech Paints',
  tagline: 'Premium paint products and supplies for your home',
  city: 'Lucknow',
  eta: '40 min delivery'
};

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Price List', to: '/price-lists' }
];

export const heroStats = [
  { value: '40 min', label: 'Local delivery' },
  { value: '15+', label: 'Paint varieties' },
  { value: '100%', label: 'Authentic' }
];

export const categoryRibbon = {
  image: categoryStripImage,
  title: 'Premium Paint Selection',
  subtitle: 'Finest quality paint products, primers, putty, brushes and finishing supplies all at best prices.'
};

export const categoryCards = [
  { name: 'Wall Paints', note: 'Interior & Exterior', accent: 'from ₹1,200' },
  { name: 'Primers', note: 'Wall & Wood', accent: 'from ₹1,180' },
  { name: 'Putty', note: 'Surface finish', accent: 'from ₹645' },
  { name: 'Tools & Accessories', note: 'Brushes & Sandpaper', accent: 'from ₹35' }
];

export const featuredProducts = [
  {
    slug: 'birla-wallcare-putty',
    name: 'Birla White WallCare Putty',
    category: 'Putty',
    pack: '30 kg bag',
    price: 685,
    unit: 'bag',
    image: birlaWallCare,
    short: 'Fine wall finishing putty for smooth interior surfaces.',
    highlights: ['Ready to finish', 'Smooth coat', 'Interior use']
  },
  {
    slug: 'asian-acrylic-putty',
    name: 'Asian TruCare Acrylic Wall Putty',
    category: 'Putty',
    pack: '20 kg bucket',
    price: 645,
    unit: 'bucket',
    image: asianAcrylicPutty,
    short: 'Acrylic wall putty for fast patching and surface prep.',
    highlights: ['Easy application', 'Low wastage', 'Premium finish']
  },
  {
    slug: 'asian-interior-primer',
    name: 'Asian TruCare Interior Wall Primer',
    category: 'Primer',
    pack: '10 L bucket',
    price: 1450,
    unit: 'bucket',
    image: asianInteriorPrimer,
    short: 'Primer designed for smooth paint adhesion on interior walls.',
    highlights: ['Better coverage', 'Interior grade', 'Painter favorite']
  },
  {
    slug: 'birla-activcoat-primer',
    name: 'Birla White Activcoat Interior Primer',
    category: 'Primer',
    pack: '20 kg bucket',
    price: 1180,
    unit: 'bucket',
    image: birlaActivcoatPrimer,
    short: 'Interior primer for wall base coats and surface prep.',
    highlights: ['Quick dry', 'Interior coat', 'Even base']
  },
  {
    slug: 'asian-wood-primer',
    name: 'Asian TruCare Wood Primer',
    category: 'Primer',
    pack: '20 L tin',
    price: 1690,
    unit: 'tin',
    image: asianWoodPrimer,
    short: 'Wood primer for doors, furniture and carpentry surfaces.',
    highlights: ['Wood finish', 'Interior/exterior', 'Workshop use']
  },
  {
    slug: 'brush-set',
    name: 'Paint Brush Set',
    category: 'Tools',
    pack: 'Set of 3',
    price: 120,
    unit: 'set',
    image: brushSet,
    short: 'Smooth brush set for touch-up, trim and roller prep work.',
    highlights: ['Set of 3', 'Best for touch-up', 'Easy grip']
  },
  {
    slug: 'sandpaper-sheet',
    name: 'Sandpaper Sheet',
    category: 'Tools',
    pack: 'Per sheet',
    price: 35,
    unit: 'sheet',
    image: sandpaperSheet,
    short: 'Useful for surface sanding before paint, polish or varnish.',
    highlights: ['Fine finish', 'Surface prep', 'Single sheet']
  }
];

export const serviceCards = [
  {
    slug: 'painting-work',
    name: 'Painting Work',
    image: servicePainting,
    priceFrom: 799,
    turnaround: 'Starts in 1 day',
    summary: 'Interior touch-up, fresh coats and clean finishing for residential spaces.',
    type: 'finish'
  }
];

export const priceHighlights = [
  { title: 'Lucknow delivery', text: 'Approx. 40 min on nearby orders' },
  { title: 'Premium quality', text: 'Authentic paint products only' },
  { title: 'Expert support', text: 'Email login and easy checkout' }
];

export const featuredServiceTypes = ['finish'];
