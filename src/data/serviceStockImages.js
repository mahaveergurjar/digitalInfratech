/**
 * Per-service default photos (under /public/services/).
 * Used when admin has not set a custom image URL.
 */
export const SERVICE_STOCK_IMAGES = {
  'elec-fan': '/services/elec-fan.webp',
  'elec-switch': '/services/elec-switch.webp',
  'elec-wiring': '/services/elec-wiring.webp',
  'elec-mcb': '/services/elec-mcb.webp',
  'plumb-leak': '/services/plumb-leak.webp',
  'plumb-tap': '/services/plumb-tap.webp',
  'plumb-drain': '/services/plumb-drain.webp',
  'plumb-geyser': '/services/plumb-geyser.webp',
  'interior-service': '/services/interior-service.webp',
  'exterior-service': '/services/exterior-service.webp',
  'wall-repair-service': '/services/wall-repair-service.webp',
  'texture-service': '/services/texture-service.webp',
  'carp-door': '/services/carp-door.webp',
  'carp-furniture': '/services/carp-furniture.webp',
  'carp-shelf': '/services/carp-shelf.webp',
  'carp-modular': '/services/carp-modular.webp',
  'ac-service': '/services/ac-service.webp',
  'ac-gas': '/services/ac-gas.webp',
  'ac-install': '/services/ac-install.webp',
  'ac-deep': '/services/ac-deep.webp',
  'clean-home': '/services/clean-home.webp',
  'clean-bathroom': '/services/clean-bathroom.webp',
  'clean-kitchen': '/services/clean-kitchen.webp',
  'clean-sofa': '/services/clean-sofa.webp',
};

export function getServiceStockImage(serviceId) {
  if (!serviceId) return '';
  return SERVICE_STOCK_IMAGES[serviceId] || '';
}
