const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');

// ROUTE 1: Place a new order
router.post('/', async (req, res) => {
  try {
    const { tableId, items, specialInstructions } = req.body;

    // Check if table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Check if table is available
    if (table.status === 'occupied') {
      return res.status(400).json({ error: 'Table is already occupied' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ error: `Menu item not found` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ error: `${menuItem.name} is not available` });
      }
      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price
      });
      totalAmount += menuItem.price * item.quantity;
    }

    // Create the order
    const order = new Order({
      table: tableId,
      items: orderItems,
      totalAmount,
      specialInstructions: specialInstructions || ''
    });
    await order.save();

    // Update table status to occupied
    table.status = 'occupied';
    table.currentOrder = order._id;
    await table.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 2: Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('table', 'tableNumber status')
      .populate('items.menuItem', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 3: Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table', 'tableNumber status')
      .populate('items.menuItem', 'name price');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 4: Update order status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If order is completed, free up the table
    if (status === 'completed') {
      await Table.findByIdAndUpdate(order.table, {
        status: 'available',
        currentOrder: null
      });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;