const express = require('express');
const router = express.Router();
const { pool, query } = require('../db');
const { validateOrder, isValidId } = require('../validators');

// Create order (place order)
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const errors = validateOrder(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    const { customer_id, items } = req.body;
    const customerId = parseInt(customer_id, 10);

    // Verify customer exists
    const customerCheck = await client.query('SELECT id FROM customers WHERE id = $1', [customerId]);
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO orders (customer_id) VALUES ($1) RETURNING *',
      [customerId]
    );
    const order = orderResult.rows[0];
    let total = 0;

    for (const item of items) {
      const product_id = parseInt(item.product_id, 10);
      const quantity = parseInt(item.quantity, 10);

      const prodRes = await client.query('SELECT * FROM products WHERE id = $1', [product_id]);
      if (prodRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: `Product ${product_id} not found` });
      }
      const product = prodRes.rows[0];

      if (product.stock < quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Not enough stock for product "${product.name}" (ID: ${product_id}). Available: ${product.stock}, Requested: ${quantity}` 
        });
      }

      const unit_price = Number(product.price);
      const lineTotal = unit_price * quantity;
      total += lineTotal;

      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order.id, product_id, quantity, unit_price]
      );

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [quantity, product_id]
      );
    }

    const updatedOrderRes = await client.query(
      'UPDATE orders SET total_amount = $1 WHERE id = $2 RETURNING *',
      [total, order.id]
    );

    await client.query('COMMIT');
    res.status(201).json(updatedOrderRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating order', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// List orders
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT o.id, o.customer_id, c.name AS customer_name, o.order_date, o.total_amount
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       ORDER BY o.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error listing orders', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// View order details (with items)
router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    const orderRes = await query(
      `SELECT o.id, o.customer_id, c.name AS customer_name, o.order_date, o.total_amount
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       WHERE o.id = $1`,
      [req.params.id]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsRes = await query(
      `SELECT oi.id, oi.product_id, p.name AS product_name,
              oi.quantity, oi.unit_price,
              (oi.quantity * oi.unit_price) AS line_total
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );

    res.json({
      order: orderRes.rows[0],
      items: itemsRes.rows
    });
  } catch (err) {
    console.error('Error getting order', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
