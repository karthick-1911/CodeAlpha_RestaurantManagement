const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// ROUTE 1: Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 2: Get menu items by category
router.get('/category/:category', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      category: req.params.category
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 3: Add a new menu item
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category
    });

    await menuItem.save();
    res.status(201).json({
      message: 'Menu item added successfully',
      menuItem
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 4: Update menu item availability
router.patch('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 5: Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;