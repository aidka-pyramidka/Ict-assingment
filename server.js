const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import route handlers
const customersRouter = require('./routes/customers');
const employeesRouter = require('./routes/employees');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use(express.static('public'));

// REST API routes
app.use('/api/customers', customersRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
