const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'grams', 'litres', 'ml', 'pieces'],
    required: true
  },
  minimumStock: {
    type: Number,
    required: true
  },
  isLowStock: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);