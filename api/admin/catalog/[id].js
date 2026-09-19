import { connectDB } from '../../_lib/db.js';
import CatalogItem from '../../_lib/CatalogItem.js';
import { requireAdmin } from '../../_lib/adminAuth.js';
import { ensureCatalogSeeded } from '../../_lib/catalog.js';
import { toClientItem, validateCatalogBody } from '../../_lib/catalogHelpers.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Item id is required' });
  }

  try {
    requireAdmin(req);
    await connectDB();
    await ensureCatalogSeeded();

    if (req.method === 'PATCH') {
      const existing = await CatalogItem.findOne({ itemId: id });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }

      const type = req.body?.type || existing.type;
      const payload = validateCatalogBody({ ...req.body, itemId: id }, type);
      const updated = await CatalogItem.findOneAndUpdate(
        { itemId: id },
        { $set: payload },
        { new: true }
      );

      return res.json({ success: true, item: toClientItem(updated) });
    }

    if (req.method === 'DELETE') {
      const deleted = await CatalogItem.findOneAndDelete({ itemId: id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      return res.json({ success: true, message: 'Item deleted' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    const status = error.status || 500;
    if (status === 500) console.error('Admin catalog delete error:', error);
    return res.status(status).json({
      success: false,
      message: error.message || 'Could not delete item',
    });
  }
}
