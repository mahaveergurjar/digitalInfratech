import { connectDB } from '../../_lib/db.js';
import CatalogItem from '../../_lib/CatalogItem.js';
import { requireAdmin } from '../../_lib/adminAuth.js';
import { ensureCatalogSeeded } from '../../_lib/catalog.js';
import { toClientItem, validateCatalogBody } from '../../_lib/catalogHelpers.js';

export default async function handler(req, res) {
  try {
    requireAdmin(req);
    await connectDB();
    await ensureCatalogSeeded();

    if (req.method === 'GET') {
      const items = await CatalogItem.find().sort({ createdAt: -1 }).lean();
      const products = items
        .filter((item) => item.type === 'product')
        .map((item, index) => toClientItem(item, index));
      const services = items
        .filter((item) => item.type === 'service')
        .map((item, index) => toClientItem(item, index));
      return res.json({ success: true, products, services });
    }

    if (req.method === 'POST') {
      const type = req.body?.type;
      if (!['product', 'service'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Type must be product or service' });
      }

      const payload = validateCatalogBody(req.body, type);
      const existing = await CatalogItem.findOne({ itemId: payload.itemId });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Item ID already exists' });
      }

      const created = await CatalogItem.create(payload);
      return res.status(201).json({ success: true, item: toClientItem(created) });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    const status = error.status || 500;
    if (status === 500) console.error('Admin catalog error:', error);
    return res.status(status).json({
      success: false,
      message: error.message || 'Catalog request failed',
    });
  }
}
