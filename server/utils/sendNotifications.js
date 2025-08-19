import Notification from "../Schema/notificationSchema.js"

export async function sendNotification({
  receiverId,
  receiverRole,
  entityType,
  message,
  extraData
}) {
  try {
    console.log("📩 Creating notification in database...");
    console.log("  - receiverId:", receiverId);
    console.log("  - receiverId type:", typeof receiverId);
    console.log("  - receiverRole:", receiverRole);
    console.log("  - message:", message);
    console.log("  - extraData:", extraData);
    
    // Keep as ObjectId (don't convert to string)
    const notificationData = {
      receiverId: receiverId,
      receiverRole,
      message,
      read: false
    };

    // Only add entityType if it's not for a patient (role 300)
    if (receiverRole !== 300 && entityType) {
      notificationData.entityType = entityType;
    }

    // Add extraData if provided
    if (extraData) {
      if (extraData.consultationId) notificationData.consultationId = extraData.consultationId;
      if (extraData.clinicName) notificationData.clinicName = extraData.clinicName;
      if (extraData.status) notificationData.status = extraData.status;
      
      // Add alternativeTime to notification document (only if not empty)
      if (extraData.alternativeTime && extraData.alternativeTime.trim()) {
        notificationData.alternativeTime = extraData.alternativeTime;
        console.log("  - alternativeTime added:", extraData.alternativeTime);
      }
      
      // Add adminNote to notification document (only if not empty)
      if (extraData.adminNote && extraData.adminNote.trim()) {
        notificationData.adminNote = extraData.adminNote;
        console.log("  - adminNote added:", extraData.adminNote);
      }
    }
    
    console.log("📩 Notification data to save:", notificationData);
    
    // Create notification in database
    const notification = await Notification.create(notificationData);
    
    console.log("✅ Notification saved successfully:");
    console.log("  - notification._id:", notification._id);
    console.log("  - notification.receiverId:", notification.receiverId);
    console.log("  - notification.message:", notification.message);
    console.log("  - notification.alternativeTime:", notification.alternativeTime);
    
    return notification;
    
  } catch (err) {
    console.error("❌ Notification error:", err.message);
    console.error("❌ Full error:", err);
    return false;
  }
}

export async function getUnreadNotificationCount(userId, userRole) {
  try {
    const count = await Notification.countDocuments({
      receiverId: userId,
      receiverRole: userRole,
      read: false
    });
    return count;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

export async function deleteOldNotifications(daysOld = 90) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate }
    });
    
    console.log(`Deleted ${result.deletedCount} old notifications`);
    return result.deletedCount;
  } catch (error) {
    console.error("Error deleting old notifications:", error);
    return 0;
  }
}