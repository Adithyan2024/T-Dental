import Notification from "../Schema/notificationSchema.js"
import mongoose from "mongoose";
import { getUnreadNotificationCount } from "../utils/sendNotifications.js";


// GET Notifications
const getNotifications = async (req, res) => {
  try {
    const patientId = req.user.id; 
    const patientRole = req.user.role; 
    
    const { page = 1, limit = 20 } = req.query;

    const patientObjectId = new mongoose.Types.ObjectId(patientId);
    
    // Always fetch only unread notifications
    const filter = { 
      receiverId: patientObjectId,
      receiverRole: patientRole,
      read: false
    };

    const notifications = await Notification.find(filter)
      .populate('consultationId', 'fullName consultationTime status')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalNotifications = await Notification.countDocuments(filter);
    const unreadCount = totalNotifications; // since we're already filtering unread

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalNotifications / limit),
          totalNotifications,
          unreadCount
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



// MARK Notification as Read
const markNotificationsAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body; // Changed from params to body for POST
    const patientId = req.user.id; // From JWT token
    
    console.log("🔍 Marking notification as read:", notificationId);
    console.log("🔍 For patient:", patientId);
    
    // Verify notification belongs to the authenticated patient
    const notification = await Notification.findOne({
      _id: notificationId,
      receiverId: new mongoose.Types.ObjectId(patientId)
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or unauthorized'
      });
    }

    // Update notification
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId, 
      { 
        read: true,
        readAt: new Date()
      },
      { new: true }
    );
    
    console.log("✅ Notification marked as read:", updatedNotification._id);
    
    res.json({ 
      success: true,
      message: 'Notification marked as read',
      notification: updatedNotification
    });
    
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
const getUnreadCount = async (req, res) => {
  try {
    const patientId = req.user.id; // From JWT token
    const patientRole = req.user.role; // From JWT token
    
    const unreadCount = await getUnreadNotificationCount(
      new mongoose.Types.ObjectId(patientId), 
      patientRole
    );
    
    res.json({
      success: true,
      unreadCount
    });
    
  } catch (error) {
    console.error('❌ Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// POST /api/notifications/read-all
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const patientId = req.user.id;

    const result = await Notification.updateMany(
      { receiverId: patientId, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    console.error('❌ Error marking all as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export { getNotifications, markNotificationsAsRead,getUnreadCount ,markAllNotificationsAsRead };
