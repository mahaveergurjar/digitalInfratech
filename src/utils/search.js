import { SERVICE_CATEGORY_META } from '../data/serviceCategoryMeta';

function matchesQuery(fields, query) {
  return fields.some((field) => field?.toLowerCase().includes(query));
}

export function searchCatalog(rawQuery, catalog) {
  const query = rawQuery.trim().toLowerCase();
  const products = catalog?.products || [];
  const services = catalog?.services || [];

  if (!query) {
    return { products: [], services: [] };
  }

  const productResults = products.filter((item) =>
    matchesQuery([item.name, item.category, item.pack], query)
  );

  const serviceResults = services.filter((item) =>
    matchesQuery([item.name, item.summary, item.category], query)
  );

  SERVICE_CATEGORY_META.forEach((category) => {
    if (matchesQuery([category.label, category.description], query)) {
      services
        .filter((service) => service.category === category.id)
        .forEach((service) => {
          if (!serviceResults.some((item) => item.id === service.id)) {
            serviceResults.push(service);
          }
        });
    }
  });

  return { products: productResults, services: serviceResults };
}
