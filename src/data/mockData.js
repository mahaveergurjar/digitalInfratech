import { resolveProductImage } from './productImages';

export const heroPaint = '/hero/home-hero.png';
export const servicePainting = '/hero/service-painting.png';

export const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

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
  'Home Refresh Colour'
];

const categoryList = ['Interior Paint', 'Exterior Paint', 'Waterproofing', 'Wood & Metal', 'Decorative Finish'];

export const uploadedImages = productNames.map((name, index) => ({
  id: `paint-${index + 1}`,
  type: 'product',
  category: categoryList[index % categoryList.length],
  name,
  pack: 'Approx. 5L / 10L pack',
  price: 550 + (index % 8) * 220,
  originalPrice: 650 + (index % 9) * 260,
  image: resolveProductImage({
    id: `paint-${index + 1}`,
    name,
    category: categoryList[index % categoryList.length],
  }, index),
}));

export const heroSlides = [
  { id: 'hero-1', image: uploadedImages[0]?.image || heroPaint, title: 'Luxury wall finishes', text: 'Diwali 15% OFF on premium painting essentials' },
];

export const categories = [
  { id: 'interior', name: 'Interior Finishes', image: uploadedImages[0]?.image || heroPaint },
  { id: 'exterior', name: 'Exterior Protection', image: uploadedImages[1]?.image || heroPaint },
  { id: 'waterproof', name: 'Waterproofing', image: uploadedImages[2]?.image || heroPaint },
  { id: 'wooden', name: 'Wood & Metal', image: uploadedImages[3]?.image || heroPaint },
];

export const products = uploadedImages;

export const paintingServices = [
  { id: 'interior-service', type: 'service', name: 'Interior Painting', summary: '2BHK painting package', price: 7999, image: servicePainting, category: 'painter' },
  { id: 'exterior-service', type: 'service', name: 'Exterior Painting', summary: 'Weatherproof exterior finish', price: 11999, image: uploadedImages[2]?.image || servicePainting, category: 'painter' },
  { id: 'wall-repair-service', type: 'service', name: 'Wall Repair & Finish', summary: 'Surface prep + premium coating', price: 6999, image: uploadedImages[3]?.image || servicePainting, category: 'painter' },
];

export const serviceCategories = [
  {
    id: 'electrician',
    label: 'Electrician',
    icon: '⚡',
    color: 'from-yellow-500 to-amber-500',
    bgLight: 'bg-yellow-50',
    borderLight: 'border-yellow-100',
    textColor: 'text-yellow-700',
    description: 'Wiring, switches, fans, MCB, earthing & all electrical repairs',
    services: [
      { id: 'elec-fan', type: 'service', name: 'Fan Installation', summary: 'Ceiling / table fan fix', price: 299, category: 'electrician', emoji: '🌀' },
      { id: 'elec-switch', type: 'service', name: 'Switch & Socket', summary: 'Replace or repair switches', price: 199, category: 'electrician', emoji: '🔌' },
      { id: 'elec-wiring', type: 'service', name: 'Home Rewiring', summary: 'Full house wiring service', price: 2499, category: 'electrician', emoji: '🔧' },
      { id: 'elec-mcb', type: 'service', name: 'MCB / Fuse Fix', summary: 'Tripping or power cut repair', price: 349, category: 'electrician', emoji: '⚡' },
    ]
  },
  {
    id: 'plumber',
    label: 'Plumber',
    icon: '🔧',
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-100',
    textColor: 'text-blue-700',
    description: 'Leaks, pipe repairs, tap installation, drain cleaning & more',
    services: [
      { id: 'plumb-leak', type: 'service', name: 'Pipe Leak Repair', summary: 'Stop drips & leaks fast', price: 399, category: 'plumber', emoji: '💧' },
      { id: 'plumb-tap', type: 'service', name: 'Tap Installation', summary: 'Kitchen / bathroom taps', price: 249, category: 'plumber', emoji: '🚿' },
      { id: 'plumb-drain', type: 'service', name: 'Drain Cleaning', summary: 'Blocked drain cleared', price: 499, category: 'plumber', emoji: '🪣' },
      { id: 'plumb-geyser', type: 'service', name: 'Geyser Fix & Install', summary: 'Water heater service', price: 599, category: 'plumber', emoji: '🔥' },
    ]
  },
  {
    id: 'painter',
    label: 'Painter',
    icon: '🖌️',
    color: 'from-orange-500 to-red-500',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-100',
    textColor: 'text-orange-700',
    description: 'Interior, exterior, wall repair and premium finishing coats',
    services: [
      { id: 'interior-service', type: 'service', name: 'Interior Painting', summary: '2BHK painting package', price: 7999, category: 'painter', emoji: '🏠' },
      { id: 'exterior-service', type: 'service', name: 'Exterior Painting', summary: 'Weatherproof exterior finish', price: 11999, category: 'painter', emoji: '🌤️' },
      { id: 'wall-repair-service', type: 'service', name: 'Wall Repair & Finish', summary: 'Surface prep + premium coating', price: 6999, category: 'painter', emoji: '🧱' },
      { id: 'texture-service', type: 'service', name: 'Texture Painting', summary: 'Designer wall textures', price: 4999, category: 'painter', emoji: '✨' },
    ]
  },
  {
    id: 'carpenter',
    label: 'Carpenter',
    icon: '🪚',
    color: 'from-amber-700 to-yellow-700',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-100',
    textColor: 'text-amber-800',
    description: 'Furniture repair, door fix, modular kitchen, shelves & more',
    services: [
      { id: 'carp-door', type: 'service', name: 'Door Repair', summary: 'Hinge, lock & frame fix', price: 399, category: 'carpenter', emoji: '🚪' },
      { id: 'carp-furniture', type: 'service', name: 'Furniture Repair', summary: 'Chair, table, wardrobe fix', price: 499, category: 'carpenter', emoji: '🪑' },
      { id: 'carp-shelf', type: 'service', name: 'Shelf / Cabinet', summary: 'Wall-mounted storage', price: 1299, category: 'carpenter', emoji: '🗄️' },
      { id: 'carp-modular', type: 'service', name: 'Modular Kitchen', summary: 'Custom kitchen fitting', price: 8999, category: 'carpenter', emoji: '🍳' },
    ]
  },
  {
    id: 'ac-repair',
    label: 'AC Repair',
    icon: '❄️',
    color: 'from-sky-500 to-blue-600',
    bgLight: 'bg-sky-50',
    borderLight: 'border-sky-100',
    textColor: 'text-sky-700',
    description: 'AC service, gas refill, installation & deep cleaning',
    services: [
      { id: 'ac-service', type: 'service', name: 'AC Servicing', summary: 'Cleaning + inspection', price: 699, category: 'ac-repair', emoji: '🌬️' },
      { id: 'ac-gas', type: 'service', name: 'Gas Refill', summary: 'Refrigerant top-up', price: 1499, category: 'ac-repair', emoji: '🧊' },
      { id: 'ac-install', type: 'service', name: 'AC Installation', summary: 'New AC fitting', price: 1999, category: 'ac-repair', emoji: '🔩' },
      { id: 'ac-deep', type: 'service', name: 'Deep Cleaning', summary: 'Thorough coil clean', price: 999, category: 'ac-repair', emoji: '🫧' },
    ]
  },
  {
    id: 'cleaning',
    label: 'Cleaning',
    icon: '🧹',
    color: 'from-emerald-500 to-green-600',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    textColor: 'text-emerald-700',
    description: 'Home deep clean, bathroom, kitchen & sofa cleaning services',
    services: [
      { id: 'clean-home', type: 'service', name: 'Home Deep Clean', summary: 'Full house cleaning', price: 1499, category: 'cleaning', emoji: '🏡' },
      { id: 'clean-bathroom', type: 'service', name: 'Bathroom Clean', summary: 'Tiles, toilet, tap sanitise', price: 699, category: 'cleaning', emoji: '🚽' },
      { id: 'clean-kitchen', type: 'service', name: 'Kitchen Scrub', summary: 'Chimney, slab, tiles clean', price: 899, category: 'cleaning', emoji: '🍽️' },
      { id: 'clean-sofa', type: 'service', name: 'Sofa / Carpet Clean', summary: 'Foam shampoo cleaning', price: 799, category: 'cleaning', emoji: '🛋️' },
    ]
  },
];

export const allHomeServices = serviceCategories.flatMap(c => c.services);
