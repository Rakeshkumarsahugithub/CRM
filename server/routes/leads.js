const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lead = require('../models/Lead');

// Create a new lead (telecaller only)
router.post('/', auth('telecaller'), async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const lead = new Lead({
      name,
      email,
      phone,
      address,
      telecaller: req.user.id
    });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all leads for telecaller
router.get('/', auth('telecaller'), async (req, res) => {
  try {
    const leads = await Lead.find({ telecaller: req.user.id });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lead address (telecaller only)
router.put('/:id/address', auth('telecaller'), async (req, res) => {
  try {
    const { address } = req.body;
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, telecaller: req.user.id },
      { address },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lead status (telecaller only)
router.put('/:id/status', auth('telecaller'), async (req, res) => {
  try {
    const { status, response } = req.body;
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, telecaller: req.user.id },
      { 
        status,
        response,
        $push: { callRecords: { status, response } },
        updatedAt: Date.now()
      },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete lead (telecaller only)
router.delete('/:id', auth('telecaller'), async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      telecaller: req.user.id
    });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;