const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// ROUTE 1: Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().populate('currentOrder');
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 2: Get available tables only
router.get('/available', async (req, res) => {
  try {
    const tables = await Table.find({ status: 'available' });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 3: Add a new table
router.post('/', async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    // Check if table number already exists
    const existing = await Table.findOne({ tableNumber });
    if (existing) {
      return res.status(400).json({ error: 'Table number already exists' });
    }

    const table = new Table({ tableNumber, capacity });
    await table.save();

    res.status(201).json({
      message: 'Table added successfully',
      table
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 4: Update table status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json({
      message: 'Table status updated successfully',
      table
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 5: Delete a table
router.delete('/:id', async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;