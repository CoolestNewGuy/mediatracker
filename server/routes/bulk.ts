import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Bulk update endpoint
router.patch('/update', async (req, res) => {
  try {
    const { ids, updates } = req.body;
    const DEFAULT_USER_ID = "default-user";
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'IDs array is required' });
    }
    
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Updates object is required' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const item = await storage.getMediaItem(id, DEFAULT_USER_ID);
        if (item) {
          const updatedItem = await storage.updateMediaItem(id, DEFAULT_USER_ID, updates);
          results.push(updatedItem);
        }
      } catch (error) {
        console.error(`Failed to update item ${id}:`, error);
      }
    }

    res.json({ updated: results.length, items: results });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Failed to update items' });
  }
});

// Bulk delete endpoint
router.delete('/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    const DEFAULT_USER_ID = "default-user";
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'IDs array is required' });
    }

    let deletedCount = 0;
    for (const id of ids) {
      try {
        await storage.deleteMediaItem(id, DEFAULT_USER_ID);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete item ${id}:`, error);
      }
    }

    res.json({ deleted: deletedCount });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Failed to delete items' });
  }
});

export default router;