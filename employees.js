const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { validateEmployee, isValidId } = require('../validators');

// Create employee
router.post('/', async (req, res) => {
  try {
    const errors = validateEmployee(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    const { name, role, email } = req.body;
    const result = await query(
      'INSERT INTO employees (name, role, email) VALUES ($1, $2, $3) RETURNING *',
      [name.trim(), role.trim(), email ? email.trim() : null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating employee', err);
    if (err.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List employees
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM employees ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error listing employees', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// View employee
router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }
    const result = await query('SELECT * FROM employees WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getting employee', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const errors = validateEmployee(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    const { name, role, email } = req.body;
    const result = await query(
      `UPDATE employees
       SET name = COALESCE($1, name),
           role = COALESCE($2, role),
           email = COALESCE($3, email)
       WHERE id = $4
       RETURNING *`,
      [
        name ? name.trim() : null,
        role ? role.trim() : null,
        email ? email.trim() : null,
        req.params.id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating employee', err);
    if (err.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }
    const result = await query('DELETE FROM employees WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error('Error deleting employee', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
