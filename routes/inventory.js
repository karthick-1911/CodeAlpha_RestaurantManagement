const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// ROUTE 1: Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 2: Get low stock items only
router.get('/lowstock', async (req, res) => {
  try {
    const items = await Inventory.find({ isLowStock: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 3: Add new inventory item
router.post('/', async (req, res) => {
  try {
    const { name, quantity, unit, minimumStock } = req.body;

    const item = new Inventory({
      name,
      quantity,
      unit,
      minimumStock,
      isLowStock: quantity <= minimumStock
    });

    await item.save();
    res.status(201).json({
      message: 'Inventory item added successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 4: Update stock quantity
router.patch('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Update quantity and check if low stock
    item.quantity = quantity;
    item.isLowStock = quantity <= item.minimumStock;
    await item.save();

    // Send alert if low stock
    if (item.isLowStock) {
      return res.json({
        message: `⚠️ Low stock alert! ${item.name} is running low!`,
        item
      });
    }

    res.json({
      message: 'Stock updated successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 5: Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;