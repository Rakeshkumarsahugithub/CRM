const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/]
  },
  phone: {
    type: Number,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'connected', 'not_connected'],
    default: 'new'
  },
  response: {
    type: String,
    enum: ['discussed', 'callback', 'interested', 'busy', 'rnr', 'switched_off', null],
    default: null
  },
  telecaller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  callRecords: [{
    status: String,
    response: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', LeadSchema);