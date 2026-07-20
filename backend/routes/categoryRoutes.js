const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Seed default categories helper
const seedDefaultsIfEmpty = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany([
        { name: 'pant', label: 'The Pant' },
        { name: 'shirt', label: 'The Shirt' },
        { name: 'combo', label: 'Combo Duos' }
      ]);
      console.log('Default categories seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding categories:', err.message);
  }
};

// GET all categories
router.get('/', async (req, res) => {
  try {
    await seedDefaultsIfEmpty();
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new category
router.post('/', async (req, res) => {
  const { name, label } = req.body;
  if (!name || !label) {
    return res.status(400).json({ message: 'Name and label fields are required.' });
  }
  try {
    const existing = await Category.findOne({ name: name.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Category name already exists.' });
    }
    const newCategory = new Category({
      name: name.trim().toLowerCase(),
      label: label.trim()
    });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  const { name, label } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    if (name) {
      const existing = await Category.findOne({ 
        name: name.trim().toLowerCase(), 
        _id: { $ne: req.params.id } 
      });
      if (existing) {
        return res.status(400).json({ message: 'Category name already exists.' });
      }
      category.name = name.trim().toLowerCase();
    }
    if (label) {
      category.label = label.trim();
    }

    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    await category.deleteOne();
    res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
