import { connectDB } from '../_lib/db.js';
import { getPublicCatalog } from '../_lib/catalog.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const catalog = await getPublicCatalog();

    return res.status(200).json({
      success: true,
      products: catalog.products,
      services: catalog.services,
    });
  } catch (error) {
    console.error('Catalog fetch error:', error);
    return res.status(500).json({ success: false, message: 'Could not load catalog' });
  }
}
