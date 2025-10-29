const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, question, answer, display_order FROM faqs ORDER BY display_order ASC, id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create FAQ (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { question, answer, display_order } = req.body;
    if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required' });

    let orderVal = display_order;
    if (orderVal === undefined || orderVal === null) {
      const [maxRow] = await db.query('SELECT COALESCE(MAX(display_order), 0) AS maxOrder FROM faqs');
      orderVal = (maxRow[0]?.maxOrder || 0) + 1;
    }

    const [result] = await db.query(
      'INSERT INTO faqs (question, answer, display_order) VALUES (?, ?, ?)',
      [question, answer, orderVal]
    );
    const [rows] = await db.query('SELECT id, question, answer, display_order FROM faqs WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update FAQ (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, display_order } = req.body;

    const updates = [];
    const vals = [];
    if (question !== undefined) { updates.push('question = ?'); vals.push(question); }
    if (answer !== undefined) { updates.push('answer = ?'); vals.push(answer); }
    if (display_order !== undefined) { updates.push('display_order = ?'); vals.push(display_order); }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    vals.push(id);

    await db.query(`UPDATE faqs SET ${updates.join(', ')} WHERE id = ?`, vals);
    const [rows] = await db.query('SELECT id, question, answer, display_order FROM faqs WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'FAQ not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete FAQ (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM faqs WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Optional: bulk reorder
router.put('/reorder/all', auth, async (req, res) => {
  try {
    const { order } = req.body; // array of {id, display_order} or array of ids
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Order must be an array' });

    // If array of ids, convert to id/display_order
    const mapped = order.map((item, idx) =>
      typeof item === 'object' ? { id: item.id, display_order: item.display_order ?? (idx + 1) } : { id: item, display_order: idx + 1 }
    );

    // Execute updates sequentially to keep it simple
    for (const row of mapped) {
      await db.query('UPDATE faqs SET display_order = ? WHERE id = ?', [row.display_order, row.id]);
    }

    const [rows] = await db.query('SELECT id, question, answer, display_order FROM faqs ORDER BY display_order ASC, id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Reorder FAQs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
