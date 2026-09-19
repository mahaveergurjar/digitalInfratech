import { resolveProductImage } from './productImages.js';

const productNames = [
  'Royal Interior Emulsion', 'Premium Wall Primer', 'Exterior Weather Coat',
  'Waterproof Sealant', 'Wood Finish Enamel', 'Metal Protector Paint',
  'Acrylic Wall Finish', 'Anti-Fungal Paint', 'Designer Wall Colour',
  'High Gloss Enamel', 'Luxury Interior Paint', 'Smart Protection Coat',
  'Home Decor Finish', 'Weather Shield Paint', 'Bright Wall Primer',
  'Stone Texture Paint', 'Concrete Seal Coat', 'Premium Roof Paint',
  'Wallcare Putty', 'Decorative Finish', 'Exterior Primer',
  'Waterproof Membrane', 'Wood Protector', 'Metal Surface Paint',
  'Emulsion Deluxe', 'Smooth Finish Paint', 'Eco Interior Coating',
  'Anti-Scratch Finish', 'Long Lasting Exterior', 'Modern Wall Paint',
  'Home Refresh Colour',
];

const categoryList = ['Interior Paint', 'Exterior Paint', 'Waterproofing', 'Wood & Metal', 'Decorative Finish'];

const serviceSeed = [
  { itemId: 'elec-fan', type: 'service', name: 'Fan Installation', summary: 'Ceiling / table fan fix', category: 'electrician', price: 299, emoji: '🌀' },
  { itemId: 'elec-switch', type: 'service', name: 'Switch & Socket', summary: 'Replace or repair switches', category: 'electrician', price: 199, emoji: '🔌' },
  { itemId: 'elec-wiring', type: 'service', name: 'Home Rewiring', summary: 'Full house wiring service', category: 'electrician', price: 2499, emoji: '🔧' },
  { itemId: 'elec-mcb', type: 'service', name: 'MCB / Fuse Fix', summary: 'Tripping or power cut repair', category: 'electrician', price: 349, emoji: '⚡' },
  { itemId: 'plumb-leak', type: 'service', name: 'Pipe Leak Repair', summary: 'Stop drips & leaks fast', category: 'plumber', price: 399, emoji: '💧' },
  { itemId: 'plumb-tap', type: 'service', name: 'Tap Installation', summary: 'Kitchen / bathroom taps', category: 'plumber', price: 249, emoji: '🚿' },
  { itemId: 'plumb-drain', type: 'service', name: 'Drain Cleaning', summary: 'Blocked drain cleared', category: 'plumber', price: 499, emoji: '🪣' },
  { itemId: 'plumb-geyser', type: 'service', name: 'Geyser Fix & Install', summary: 'Water heater service', category: 'plumber', price: 599, emoji: '🔥' },
  { itemId: 'interior-service', type: 'service', name: 'Interior Painting', summary: '2BHK painting package', category: 'painter', price: 7999, emoji: '🏠' },
  { itemId: 'exterior-service', type: 'service', name: 'Exterior Painting', summary: 'Weatherproof exterior finish', category: 'painter', price: 11999, emoji: '🌤️' },
  { itemId: 'wall-repair-service', type: 'service', name: 'Wall Repair & Finish', summary: 'Surface prep + premium coating', category: 'painter', price: 6999, emoji: '🧱' },
  { itemId: 'texture-service', type: 'service', name: 'Texture Painting', summary: 'Designer wall textures', category: 'painter', price: 4999, emoji: '✨' },
  { itemId: 'carp-door', type: 'service', name: 'Door Repair', summary: 'Hinge, lock & frame fix', category: 'carpenter', price: 399, emoji: '🚪' },
  { itemId: 'carp-furniture', type: 'service', name: 'Furniture Repair', summary: 'Chair, table, wardrobe fix', category: 'carpenter', price: 499, emoji: '🪑' },
  { itemId: 'carp-shelf', type: 'service', name: 'Shelf / Cabinet', summary: 'Wall-mounted storage', category: 'carpenter', price: 1299, emoji: '🗄️' },
  { itemId: 'carp-modular', type: 'service', name: 'Modular Kitchen', summary: 'Custom kitchen fitting', category: 'carpenter', price: 8999, emoji: '🍳' },
  { itemId: 'ac-service', type: 'service', name: 'AC Servicing', summary: 'Cleaning + inspection', category: 'ac-repair', price: 699, emoji: '🌬️' },
  { itemId: 'ac-gas', type: 'service', name: 'Gas Refill', summary: 'Refrigerant top-up', category: 'ac-repair', price: 1499, emoji: '🧊' },
  { itemId: 'ac-install', type: 'service', name: 'AC Installation', summary: 'New AC fitting', category: 'ac-repair', price: 1999, emoji: '🔩' },
  { itemId: 'ac-deep', type: 'service', name: 'Deep Cleaning', summary: 'Thorough coil clean', category: 'ac-repair', price: 999, emoji: '🫧' },
  { itemId: 'clean-home', type: 'service', name: 'Home Deep Clean', summary: 'Full house cleaning', category: 'cleaning', price: 1499, emoji: '🏡' },
  { itemId: 'clean-bathroom', type: 'service', name: 'Bathroom Clean', summary: 'Tiles, toilet, tap sanitise', category: 'cleaning', price: 699, emoji: '🚽' },
  { itemId: 'clean-kitchen', type: 'service', name: 'Kitchen Scrub', summary: 'Chimney, slab, tiles clean', category: 'cleaning', price: 899, emoji: '🍽️' },
  { itemId: 'clean-sofa', type: 'service', name: 'Sofa / Carpet Clean', summary: 'Foam shampoo cleaning', category: 'cleaning', price: 799, emoji: '🛋️' },
];

export const EXPECTED_PRODUCT_COUNT = productNames.length;

export function getDefaultCatalogItems() {
  const products = productNames.map((name, index) => {
    const itemId = `paint-${index + 1}`;
    const category = categoryList[index % categoryList.length];
    return {
      itemId,
      type: 'product',
      name,
      summary: '',
      category,
      pack: 'Approx. 5L / 10L pack',
      price: 550 + (index % 8) * 220,
      originalPrice: 650 + (index % 9) * 260,
      image: resolveProductImage({ itemId, name, category }, index),
      emoji: '🛠️',
      active: true,
      createdAt: index + 1,
    };
  });

  const services = serviceSeed.map((service) => ({
    ...service,
    summary: service.summary || '',
    pack: '',
    originalPrice: 0,
    image: '',
    active: true,
  }));

  return [...products, ...services];
}
