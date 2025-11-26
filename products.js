const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { validateProduct, isValidId } = require('../validators');

// Add product
router.post('/', async (req, res) => {
  try {
    const errors = validateProduct(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    const { name, description, price, stock } = req.body;
    const result = await query(
      'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [
        name.trim(),
        description ? description.trim() : null,
        parseFloat(price),
        stock !== undefined && stock !== null ? parseInt(stock, 10) : 0
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List products
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error listing products', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// View product
router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const result = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getting product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product & inventory
router.put('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const errors = validateProduct(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    const { name, description, price, stock } = req.body;
    const updateValues = [];
    const updateFields = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      updateValues.push(name.trim());
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      updateValues.push(description ? description.trim() : null);
    }
    if (price !== undefined) {
      updateFields.push(`price = $${paramCount++}`);
      updateValues.push(parseFloat(price));
    }
    if (stock !== undefined) {
      updateFields.push(`stock = $${paramCount++}`);
      updateValues.push(parseInt(stock, 10));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(req.params.id);
    const result = await query(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      updateValues
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
