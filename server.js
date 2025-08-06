const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);

const orderRouter = require('express').Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('./controllers/orderController');

orderRouter.post('/', createOrder);

orderRouter.use(authenticateToken);
orderRouter.get('/', getOrders);
orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id', updateOrderStatus);
orderRouter.delete('/:id', deleteOrder);

// Gebruik de aangepaste router
app.use('/api/orders', orderRouter);

// Connectie met database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port', process.env.PORT || 5000);
    });
  })
  .catch((err) => console.error(err));
