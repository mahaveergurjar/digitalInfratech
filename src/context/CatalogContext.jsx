import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config/api';
import { adminFetch } from './AdminAuthContext';
import { parseJsonResponse } from '../utils/http';
import {
  buildServiceCategories,
  createCatalogItem,
  getDefaultCatalog,
  loadCatalogFromStorage,
  mergeWithDefaultCatalog,
  normalizeCatalogItem,
  saveCatalogToStorage,
  updateCatalogItem,
} from '../utils/catalogHelpers';
import { SERVICE_CATEGORY_META } from '../data/serviceCategoryMeta';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingApi, setUsingApi] = useState(false);

  const applyCatalog = useCallback((catalog) => {
    setProducts(catalog.products.map((item, index) => normalizeCatalogItem(item, index)));
    setServices(catalog.services.map((item, index) => normalizeCatalogItem(item, index)));
    saveCatalogToStorage(catalog);
  }, []);

  const refreshCatalog = useCallback(async (options = {}) => {
    const background = options.background === true;
    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      try {
        const response = await fetch(`${API_URL}/catalog`);
        if (response.ok) {
          const { data, parseError } = await parseJsonResponse(response);
          if (data?.products || data?.services) {
            applyCatalog(
              mergeWithDefaultCatalog({
                products: data.products || [],
                services: data.services || [],
              }),
            );
            setUsingApi(true);
            return;
          }
          if (parseError) {
            console.warn('Catalog API returned invalid JSON:', parseError);
          }
        }
      } catch {
        // fall through to local storage
      }

      const stored = loadCatalogFromStorage();
      applyCatalog(stored || getDefaultCatalog());
      setUsingApi(false);
    } finally {
      if (background) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [applyCatalog]);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const serviceCategories = useMemo(() => buildServiceCategories(services), [services]);
  const allHomeServices = services;

  const addItem = useCallback(
    async (type, body, token) => {
      const localItem = createCatalogItem(type, body);

      if (token && usingApi) {
        try {
          const response = await adminFetch('/admin/catalog', token, {
            method: 'POST',
            body: JSON.stringify({ ...body, type }),
          });
          const { data, parseError } = await parseJsonResponse(response);
          if (!data || !response.ok) throw new Error(data?.message || parseError || 'Could not add item');
          await refreshCatalog({ background: true });
          return data.item;
        } catch (error) {
          throw error;
        }
      }

      if (type === 'product') {
        const nextProducts = [localItem, ...products];
        setProducts(nextProducts);
        saveCatalogToStorage({ products: nextProducts, services });
      } else {
        const nextServices = [localItem, ...services];
        setServices(nextServices);
        saveCatalogToStorage({ products, services: nextServices });
      }

      return localItem;
    },
    [products, services, refreshCatalog, usingApi]
  );

  const updateItem = useCallback(
    async (type, id, body, token) => {
      const existing =
        type === 'product'
          ? products.find((item) => item.id === id)
          : services.find((item) => item.id === id);
      const localItem = updateCatalogItem(type, id, {
        ...body,
        createdAt: existing?.createdAt,
      });

      if (token && usingApi) {
        const response = await adminFetch(`/admin/catalog/${id}`, token, {
          method: 'PATCH',
          body: JSON.stringify({ ...body, type }),
        });
        const { data, parseError } = await parseJsonResponse(response);
        if (!data || !response.ok) throw new Error(data?.message || parseError || 'Could not update item');
        await refreshCatalog({ background: true });
        return data.item;
      }

      if (type === 'product') {
        const nextProducts = products.map((item) => (item.id === id ? localItem : item));
        setProducts(nextProducts);
        saveCatalogToStorage({ products: nextProducts, services });
      } else {
        const nextServices = services.map((item) => (item.id === id ? localItem : item));
        setServices(nextServices);
        saveCatalogToStorage({ products, services: nextServices });
      }

      return localItem;
    },
    [products, services, refreshCatalog, usingApi]
  );

  const deleteItem = useCallback(
    async (id, token) => {
      if (token && usingApi) {
        const response = await adminFetch(`/admin/catalog/${id}`, token, { method: 'DELETE' });
        const { data, parseError } = await parseJsonResponse(response);
        if (!data || !response.ok) throw new Error(data?.message || parseError || 'Could not delete item');
        await refreshCatalog({ background: true });
        return;
      }

      const nextProducts = products.filter((item) => item.id !== id);
      const nextServices = services.filter((item) => item.id !== id);
      setProducts(nextProducts);
      setServices(nextServices);
      saveCatalogToStorage({ products: nextProducts, services: nextServices });
    },
    [products, services, refreshCatalog, usingApi]
  );

  const value = useMemo(
    () => ({
      products,
      services,
      allHomeServices,
      serviceCategories,
      serviceCategoryMeta: SERVICE_CATEGORY_META,
      loading,
      refreshing,
      usingApi,
      refreshCatalog,
      addItem,
      updateItem,
      deleteItem,
    }),
    [
      products,
      services,
      allHomeServices,
      serviceCategories,
      loading,
      refreshing,
      usingApi,
      refreshCatalog,
      addItem,
      updateItem,
      deleteItem,
    ]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
