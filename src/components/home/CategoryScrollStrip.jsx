import { Link } from 'react-router-dom';
import { paintCategories, paintCategoryLink } from '../../data/siteContent';
import { useCatalog } from '../../context/CatalogContext';

function countProductsInCategory(products, category) {
  if (category.filterType === 'category') {
    return products.filter((product) => product.category === category.filter).length;
  }

  if (category.filterType === 'name') {
    const pattern = new RegExp(category.filter, 'i');
    return products.filter((product) => pattern.test(product.name)).length;
  }

  return 0;
}

function categoryLink(category) {
  return paintCategoryLink(category);
}

export default function CategoryScrollStrip() {
  const { products } = useCatalog();

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-7">
        <div>
          <span className="kicker">🎨 Paint catalogue</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#4a3728] leading-tight">
            Shop paints by category
          </h2>
          <p className="text-[#8b7355] text-sm mt-1.5">Premium brands · 40 min delivery · Pay on delivery</p>
        </div>
        <Link
          to="/products"
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#c05621] hover:text-[#ea7a2a] no-underline border border-[#edd9b8] rounded-xl px-4 py-2 hover:bg-[#fff3d6] transition-all"
        >
          All paints →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {paintCategories.map((category) => {
          const productCount = countProductsInCategory(products, category);

          return (
            <Link
              key={category.id}
              to={categoryLink(category)}
              className="group relative card-premium no-underline text-center p-5 flex flex-col items-center gap-3 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-[20px] bg-gradient-to-r ${category.color}`} />
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform bg-gradient-to-br ${category.color} shadow-sm`}
                style={{
                  background: `linear-gradient(135deg, rgba(var(--tw-gradient-from-position),0.12), rgba(var(--tw-gradient-to-position),0.08))`,
                }}
              >
                <span className="text-3xl">{category.icon}</span>
              </div>
              <div>
                <p className="text-sm font-black text-[#4a3728] group-hover:text-[#c05621] transition-colors leading-tight">
                  {category.label}
                </p>
                <p className="text-[10px] text-[#a08060] mt-0.5 font-semibold">
                  {productCount} {productCount === 1 ? 'product' : 'products'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
