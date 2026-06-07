const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Get all notifications for logged in user
router.get('/', protect, getMyNotifications);

// Mark single notification as read
router.put('/:id/read', protect, markAsRead);

// Mark all notifications as read
router.put('/markallread', protect, markAllAsRead);

// Delete all notifications
router.delete('/deleteall', protect, deleteAllNotifications);

// Delete single notification
router.delete('/:id', protect, deleteNotification);

module.exports = router;