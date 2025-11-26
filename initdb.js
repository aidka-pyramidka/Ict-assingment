require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

const dbName = process.env.DB_NAME || 'ecommerce_db';

// SQL for creating tables
const schemaSQL = `
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_date TIMESTAMP DEFAULT NOW(),
    total_amount NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL
);
`;

(async () => {
  try {
    const masterClient = new Client({
      connectionString: process.env.DATABASE_URL_MASTER, // postgres
    });
    await masterClient.connect();

    const existsRes = await masterClient.query(
      `SELECT FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (existsRes.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await masterClient.query(`CREATE DATABASE ${dbName}`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }

    await masterClient.end();

    const dbClient = new Client({
      connectionString: process.env.DATABASE_URL, 
    });
    await dbClient.connect();

    console.log("Creating tables...");
    await dbClient.query(schemaSQL);

    await dbClient.end();
    console.log("Done! Database and tables created successfully.");
  } catch (err) {
    console.error("Error initializing DB:", err);
    process.exit(1);
  }
})();
