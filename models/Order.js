// models/Orde
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  flavor: { type: String, required: true },
  topping: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['te verwerken', 'verzonden', 'geannuleerd'], default: 'te verwerken' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
