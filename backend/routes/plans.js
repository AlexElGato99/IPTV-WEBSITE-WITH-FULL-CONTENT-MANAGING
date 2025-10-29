const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all unique device tabs (public endpoint)
router.get('/device-tabs', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT device_tab FROM plans ORDER BY CAST(device_tab AS UNSIGNED)');
    const tabs = rows.map(row => row.device_tab);
    res.json(tabs);
  } catch (error) {
    console.error('Get device tabs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new device tab (protected endpoint)
router.post('/device-tabs', authMiddleware, async (req, res) => {
  try {
    const { tabName } = req.body;
    
    if (!tabName || tabName.trim() === '') {
      return res.status(400).json({ error: 'Tab name is required' });
    }

    // Check if tab already exists
    const [existing] = await db.query('SELECT DISTINCT device_tab FROM plans WHERE device_tab = ?', [tabName.trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'This device tab already exists' });
    }

    // Create a placeholder plan for the new tab (so it appears in the list)
    // Admin can then edit this plan or add more plans for this tab
    await db.query(
      'INSERT INTO plans (device_tab, name, price, features, display_order, is_featured, buy_link) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [tabName.trim(), 'New Plan', '0', JSON.stringify(['Feature 1', 'Feature 2']), 0, false, '']
    );

    res.json({ message: 'Device tab created successfully', tabName: tabName.trim() });
  } catch (error) {
    console.error('Add device tab error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update/rename a device tab (protected endpoint)
router.put('/device-tabs/:oldTab', authMiddleware, async (req, res) => {
  try {
    const { oldTab } = req.params;
    const { newTabName } = req.body;

    if (!newTabName || newTabName.trim() === '') {
      return res.status(400).json({ error: 'New tab name is required' });
    }

    // Check if old tab exists
    const [existing] = await db.query('SELECT COUNT(*) as count FROM plans WHERE device_tab = ?', [oldTab]);
    if (existing[0].count === 0) {
      return res.status(404).json({ error: 'Device tab not found' });
    }

    // Check if new tab name already exists (and it's different from old tab)
    if (oldTab !== newTabName.trim()) {
      const [duplicate] = await db.query('SELECT COUNT(*) as count FROM plans WHERE device_tab = ?', [newTabName.trim()]);
      if (duplicate[0].count > 0) {
        return res.status(400).json({ error: 'A tab with this name already exists' });
      }
    }

    // Update all plans with the old tab name to the new tab name
    await db.query('UPDATE plans SET device_tab = ? WHERE device_tab = ?', [newTabName.trim(), oldTab]);

    res.json({ message: 'Device tab renamed successfully', oldTab, newTab: newTabName.trim() });
  } catch (error) {
    console.error('Update device tab error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a device tab and all its plans (protected endpoint)
router.delete('/device-tabs/:tab', authMiddleware, async (req, res) => {
  try {
    const { tab } = req.params;

    // Check if tab has plans
    const [plans] = await db.query('SELECT COUNT(*) as count FROM plans WHERE device_tab = ?', [tab]);
    
    if (plans[0].count === 0) {
      return res.status(404).json({ error: 'Device tab not found' });
    }

    // Delete all plans for this device tab
    await db.query('DELETE FROM plans WHERE device_tab = ?', [tab]);

    res.json({ message: 'Device tab and all its plans deleted successfully' });
  } catch (error) {
    console.error('Delete device tab error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all plans (public endpoint)
router.get('/', async (req, res) => {
  try {
    const { device_tab } = req.query;
    
    let query = 'SELECT * FROM plans';
    let params = [];

    if (device_tab) {
      query += ' WHERE device_tab = ?';
      params.push(device_tab);
    }

    query += ' ORDER BY device_tab, display_order';

    const [rows] = await db.query(query, params);
    
    // Parse features JSON for each plan
    const plans = rows.map(plan => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : []
    }));

    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single plan (public endpoint)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM plans WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = {
      ...rows[0],
      features: rows[0].features ? JSON.parse(rows[0].features) : []
    };

    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create plan (protected endpoint)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { device_tab, name, price, features, display_order, is_featured, buy_link } = req.body;

    if (!device_tab || !name || !price) {
      return res.status(400).json({ error: 'device_tab, name, and price are required' });
    }

    // Validate that the device_tab exists by checking if there are any plans with this tab
    // (or allow any tab name for flexibility)
    
    const featuresJson = JSON.stringify(features || []);

    const [result] = await db.query(
      'INSERT INTO plans (device_tab, name, price, features, display_order, is_featured, buy_link) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [device_tab, name, price, featuresJson, display_order || 0, is_featured ? 1 : 0, buy_link || null]
    );

    const [rows] = await db.query('SELECT * FROM plans WHERE id = ?', [result.insertId]);
    const plan = {
      ...rows[0],
      features: rows[0].features ? JSON.parse(rows[0].features) : []
    };

    res.status(201).json(plan);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update plan (protected endpoint)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { device_tab, name, price, features, display_order, is_featured, buy_link } = req.body;

    const updateFields = [];
    const values = [];

    if (device_tab !== undefined) {
      // Allow any device_tab value now (no restriction)
      updateFields.push('device_tab = ?');
      values.push(device_tab);
    }
    if (name !== undefined) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      values.push(price);
    }
    if (features !== undefined) {
      updateFields.push('features = ?');
      values.push(JSON.stringify(features));
    }
    if (display_order !== undefined) {
      updateFields.push('display_order = ?');
      values.push(display_order);
    }
    if (is_featured !== undefined) {
      updateFields.push('is_featured = ?');
      values.push(is_featured ? 1 : 0);
    }
    if (buy_link !== undefined) {
      updateFields.push('buy_link = ?');
      values.push(buy_link || null);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);

    await db.query(
      `UPDATE plans SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    const [rows] = await db.query('SELECT * FROM plans WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = {
      ...rows[0],
      features: rows[0].features ? JSON.parse(rows[0].features) : []
    };

    res.json(plan);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete plan (protected endpoint)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM plans WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
