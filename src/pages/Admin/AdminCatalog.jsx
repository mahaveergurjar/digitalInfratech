import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCatalog } from '../../context/CatalogContext';
import { money } from '../../data/mockData';
import { PRODUCT_CATEGORIES, SERVICE_CATEGORY_META } from '../../data/serviceCategoryMeta';
import { getDiscountPercent } from '../../utils/catalogHelpers';

const emptyProductForm = {
  name: '',
  category: PRODUCT_CATEGORIES[0],
  pack: 'Approx. 5L / 10L pack',
  price: '',
  discount: '',
  image: '',
};

const emptyServiceForm = {
  name: '',
  summary: '',
  category: SERVICE_CATEGORY_META[0].id,
  price: '',
  emoji: '🛠️',
  image: '',
};

export default function AdminCatalog() {
  const { isAdmin, token } = useAdminAuth();
  const { products, services, loading, refreshing, usingApi, addItem, updateItem, deleteItem, refreshCatalog } = useCatalog();
  const formSectionRef = useRef(null);
  const [tab, setTab] = useState('products');
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    resetProductForm();
    resetServiceForm();
    setError('');
    setMessage('');
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (editingProductId) {
        await updateItem('product', editingProductId, productForm, token);
        resetProductForm();
        setMessage('Product updated successfully.');
      } else {
        await addItem('product', productForm, token);
        resetProductForm();
        setMessage('Product added successfully.');
      }
    } catch (err) {
      setError(err.message || (editingProductId ? 'Could not update product' : 'Could not add product'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleServiceSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (editingServiceId) {
        await updateItem('service', editingServiceId, serviceForm, token);
        resetServiceForm();
        setMessage('Service updated successfully.');
      } else {
        await addItem('service', serviceForm, token);
        resetServiceForm();
        setMessage('Service added successfully.');
      }
    } catch (err) {
      setError(err.message || (editingServiceId ? 'Could not update service' : 'Could not add service'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (item) => {
    setTab('products');
    resetServiceForm();
    setEditingProductId(item.id);
    setProductForm({
      name: item.name,
      category: item.category,
      pack: item.pack,
      price: String(item.price),
      discount: String(getDiscountPercent(item.price, item.originalPrice)),
      image: item.image || '',
    });
    setError('');
    setMessage('');
    scrollToForm();
  };

  const handleEditService = (item) => {
    setTab('services');
    resetProductForm();
    setEditingServiceId(item.id);
    setServiceForm({
      name: item.name,
      summary: item.summary,
      category: item.category,
      price: String(item.price),
      emoji: item.emoji || '🛠️',
      image: item.image || '',
    });
    setError('');
    setMessage('');
    scrollToForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    setError('');
    setMessage('');

    try {
      await deleteItem(id, token);
      if (editingProductId === id) resetProductForm();
      if (editingServiceId === id) resetServiceForm();
      setMessage('Item deleted.');
    } catch (err) {
      setError(err.message || 'Could not delete item');
    }
  };

  const productDiscountPreview =
    productForm.price && productForm.discount
      ? Math.round(Number(productForm.price) / (1 - Math.min(99, Number(productForm.discount)) / 100))
      : null;

  return (
    <AdminLayout title="Catalog Manager">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTabChange('products')}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === 'products' ? 'bg-slate-900 text-white' : 'bg-white border border-stone-200 text-stone-700'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('services')}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === 'services' ? 'bg-slate-900 text-white' : 'bg-white border border-stone-200 text-stone-700'
            }`}
          >
            Services ({services.length})
          </button>
        </div>
        <button
          type="button"
          onClick={() => refreshCatalog({ background: true })}
          disabled={refreshing}
          className="text-sm font-semibold text-stone-700 border border-stone-200 bg-white px-4 py-2 rounded-xl hover:bg-stone-50 disabled:opacity-60"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <p className="text-sm text-stone-500 mb-4">
        {usingApi ? 'Connected to database catalog.' : 'Using local catalog (API unavailable). New items still appear in search automatically.'}
      </p>

      {error && <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
      {message && <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">{message}</p>}

      {loading ? (
        <p className="text-stone-500">Loading catalog...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          <section ref={formSectionRef} className="bg-white rounded-2xl border border-stone-200 p-5 h-fit">
            <h2 className="text-lg font-black text-stone-900 mb-4">
              {tab === 'products'
                ? editingProductId
                  ? 'Edit Product'
                  : 'Add Product'
                : editingServiceId
                  ? 'Edit Service'
                  : 'Add Service'}
            </h2>

            {tab === 'products' ? (
              <form onSubmit={handleProductSubmit} className="space-y-3">
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
                <select
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Pack size"
                  value={productForm.pack}
                  onChange={(e) => setProductForm({ ...productForm, pack: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="Selling price"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="Discount %"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                  />
                </div>
                {productDiscountPreview && productDiscountPreview > Number(productForm.price) && (
                  <p className="text-xs text-stone-500">
                    MRP: {money.format(productDiscountPreview)}
                  </p>
                )}
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Image URL (optional)"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                />
                <div className="flex gap-2">
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="flex-1 border border-stone-200 text-stone-700 font-bold py-2.5 rounded-xl hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl disabled:opacity-60"
                  >
                    {submitting
                      ? editingProductId
                        ? 'Saving...'
                        : 'Adding...'
                      : editingProductId
                        ? 'Save Changes'
                        : 'Add Product'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleServiceSubmit} className="space-y-3">
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Service name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  required
                />
                <textarea
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Short summary"
                  value={serviceForm.summary}
                  onChange={(e) => setServiceForm({ ...serviceForm, summary: e.target.value })}
                  required
                />
                <select
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                >
                  {SERVICE_CATEGORY_META.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="Price"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    required
                  />
                  <input
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="Emoji"
                    value={serviceForm.emoji}
                    onChange={(e) => setServiceForm({ ...serviceForm, emoji: e.target.value })}
                  />
                </div>
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Image URL (optional)"
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                />
                <div className="flex gap-2">
                  {editingServiceId && (
                    <button
                      type="button"
                      onClick={resetServiceForm}
                      className="flex-1 border border-stone-200 text-stone-700 font-bold py-2.5 rounded-xl hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl disabled:opacity-60"
                  >
                    {submitting
                      ? editingServiceId
                        ? 'Saving...'
                        : 'Adding...'
                      : editingServiceId
                        ? 'Save Changes'
                        : 'Add Service'}
                  </button>
                </div>
              </form>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h2 className="text-lg font-black text-stone-900">
                {tab === 'products' ? 'All Products' : 'All Services'}
              </h2>
            </div>

            {(tab === 'products' ? products : services).length === 0 ? (
              <p className="p-8 text-stone-500 text-center">No items yet.</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {(tab === 'products' ? products : services).map((item) => {
                  const discount =
                    tab === 'products' ? getDiscountPercent(item.price, item.originalPrice) : 0;
                  const isEditing =
                    tab === 'products'
                      ? editingProductId === item.id
                      : editingServiceId === item.id;

                  return (
                    <li
                      key={item.id}
                      className={`px-5 py-4 flex items-start justify-between gap-4 ${
                        isEditing ? 'bg-orange-50/60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-stone-100 shrink-0"
                          />
                        ) : (
                          <span className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-xl shrink-0">
                            {item.emoji || '📦'}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900">{item.name}</p>
                          <p className="text-sm text-stone-500 mt-1">
                            {tab === 'products' ? item.pack : item.summary}
                          </p>
                          <p className="text-xs text-stone-400 mt-1">
                            {item.category} · {money.format(item.price)}
                            {discount > 0 && (
                              <span className="ml-2 text-rose-600 font-semibold">
                                {discount}% off · MRP {money.format(item.originalPrice)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            tab === 'products' ? handleEditProduct(item) : handleEditService(item)
                          }
                          className="text-sm font-semibold text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}
    </AdminLayout>
  );
}
