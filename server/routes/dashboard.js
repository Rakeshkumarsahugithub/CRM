const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Lead = require('../models/Lead');

// Get dashboard stats (admin only)
router.get('/stats', auth('admin'), async (req, res) => {
  try {
    const totalTelecallers = await User.countDocuments({ role: 'telecaller' });
    const totalLeads = await Lead.countDocuments();
    const connectedLeads = await Lead.countDocuments({ status: 'connected' });
    
    res.json({
      totalTelecallers,
      totalLeads,
      connectedLeads
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get call trends (admin only)
router.get('/trends', auth('admin'), async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const trends = await Lead.aggregate([
      {
        $match: {
          updatedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get connected call records (admin only)
router.get('/calls', auth('admin'), async (req, res) => {
  try {
    const calls = await Lead.find({ status: 'connected' })
      .populate('telecaller', 'name')
      .sort({ updatedAt: -1 })
      .limit(10);
    
    res.json(calls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;