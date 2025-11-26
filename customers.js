const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { validateCustomer, isValidId } = require('../validators');

// Add customer
router.post('/', async (req, res) => {
  try {
    const errors = validateCustomer(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    const { name, email, phone, address } = req.body;
    const result = await query(
      'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.trim(), email.trim(), phone ? phone.trim() : null, address ? address.trim() : null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating customer', err);
    if (err.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List customers
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM customers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error listing customers', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// View one customer
router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }
    const result = await query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getting customer', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    const errors = validateCustomer(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    const { name, email, phone, address } = req.body;
    const result = await query(
      `UPDATE customers
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           address = COALESCE($4, address)
       WHERE id = $5
       RETURNING *`,
      [
        name ? name.trim() : null,
        email ? email.trim() : null,
        phone ? phone.trim() : null,
        address ? address.trim() : null,
        req.params.id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating customer', err);
    if (err.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }
    const result = await query('DELETE FROM customers WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    console.error('Error deleting customer', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
