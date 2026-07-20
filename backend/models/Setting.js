const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  storeName: { type: String, default: 'blackdistricts' },
  storeEmail: { type: String, default: 'support@blackdistricts.com' },
  storePhone: { type: String, default: '+91 98765 43210' },
  storeAddress: { type: String, default: '123, Fashion Street, Surat, Gujarat, India - 395001' },
  storeDesc: { type: String, default: 'blackdistricts offers premium quality fashion products for everyone.' },
  language: { type: String, default: 'en' },
  storeCurrency: { type: String, default: 'INR' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  dateFormat: { type: String, default: '18 July 2026' },
  timeFormat: { type: String, default: '24h' },
  autoConfirm: { type: Boolean, default: true },
  lowStockAlert: { type: Boolean, default: true },
  enableNotes: { type: Boolean, default: true },
  notifyNewOrder: { type: Boolean, default: true },
  notifyCustReg: { type: Boolean, default: true },
  notifyLowStock: { type: Boolean, default: false },
  storeLogo: { type: String, default: '' },
  adminAvatar: { type: String, default: '' },
  adminName: { type: String, default: 'Deepak Kumar' },
  adminEmail: { type: String, default: 'dk897869@gmail.com' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
