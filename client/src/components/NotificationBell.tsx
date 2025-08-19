import { useEffect, useState } from "react";
import { Bell, X, CheckCircle, Clock, MessageSquare } from "lucide-react";
import baseUrl from "../../baseUrl";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
  alternativeTime?: string;
  adminNote?: string;
  clinicName?: string;
  status?: string;
  consultationId?: {
    _id: string;
    fullName: string;
    consultationTime: string;
    status: string;
  };
}

interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalNotifications: number;
      unreadCount: number;
    };
  };
}

export default function NotificationBell() {
  const user = useSelector((state: RootState) => state.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const token=useSelector((state: RootState) => state.user.token)
 
  

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user?.token) {
      console.warn("⚠️ No user token found");
      return;
    }
    
    // setLoading(true);
    try {
      console.log("📞 Fetching notifications from API...");
      const response = await fetch(`${baseUrl}/api/notifications/get-notifications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: NotificationResponse = await response.json();
        console.log("📧 Fetched notifications:", data);
        
        if (data.success) {
          setNotifications(data.data.notifications);
          setUnreadCount(data.data.pagination.unreadCount);
        }
      } else {
        console.error("❌ Failed to fetch notifications:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    if (!user?.token) return;

    try {
      console.log("✅ Marking notification as read:", notificationId);
      const response = await fetch(`${baseUrl}/api/notifications/read-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        console.log("✅ Notification marked as read successfully");
        // Update the local state
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, read: true }
              : notif
          )
        );
        // Decrease unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        fetchNotifications()
      } else {
        console.error("❌ Failed to mark notification as read");
      }
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
// Mark all notifications as read
const markAllAsRead = async () => {
  if (!user?.token) return;

  try {
    console.log("✅ Marking all notifications as read");
    const response = await fetch(`${baseUrl}/api/notifications/read-all-notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log("✅ All notifications marked as read");

      // Update local state immediately (optimistic update)
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);

      // Optional: re-fetch from server for full sync
      fetchNotifications();
    } else {
      console.error("❌ Failed to mark all notifications as read");
    }
  } catch (error) {
    console.error("❌ Error marking all notifications as read:", error);
  }
};


  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    console.log("📦 User state:", user);
    if (user?.token) {
      fetchNotifications();
      
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.token]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
      {/* Bell Icon */}
      <div className="notification-dropdown" style={{ position: "relative", zIndex: 1000 }}>
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#fff",
            borderRadius: "50%",
            padding: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => setShowDropdown((prev) => !prev)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Bell size={24} color="#333" />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "50%",
                fontSize: "11px",
                fontWeight: "600",
                padding: "2px 6px",
                minWidth: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>

        {/* Dropdown Notification List */}
        {showDropdown && (
          <div
            style={{
              position: "fixed",
              top: "70px",
              right: "20px",
              width: "400px",
              maxWidth: "calc(100vw - 40px)",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              overflow: "hidden",
              animation: "dropdownGrow 0.25s ease-out",
              maxHeight: "500px",
              border: "1px solid #e5e5e5",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f8f9fa"
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: "16px", 
                fontWeight: "600",
                color: "#333"
              }}>
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ 
                padding: "20px", 
                textAlign: "center", 
                color: "#666" 
              }}>
                Loading notifications...
              </div>
            )}

            {/* Notifications List */}
            {!loading && (
              <div style={{ 
                maxHeight: "400px", 
                overflowY: "auto" 
              }}>
                {notifications.length === 0 ? (
                  <div style={{ 
                    padding: "40px 20px", 
                    textAlign: "center", 
                    color: "#666" 
                  }}>
                    <Bell size={40} color="#ccc" style={{ marginBottom: "10px" }} />
                    <p style={{ margin: 0, fontSize: "14px" }}>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #f0f0f0",
                        cursor: "pointer",
                        background: notification.read ? "#fff" : "#f8f9ff",
                        transition: "background-color 0.2s ease",
                        position: "relative"
                      }}
                      onClick={() => {
                        if (!notification.read) {
                          markNotificationAsRead(notification._id);
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = notification.read ? "#f9f9f9" : "#f0f4ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = notification.read ? "#fff" : "#f8f9ff";
                      }}
                    >
                      {/* Status indicator */}
                      {!notification.read && (
                        <div style={{
                          position: "absolute",
                          left: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "8px",
                          height: "8px",
                          background: "#3b82f6",
                          borderRadius: "50%"
                        }} />
                      )}

                      <div style={{ marginLeft: notification.read ? "0" : "20px" }}>
                        {/* Message */}
                        <p style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          color: "#333",
                          lineHeight: "1.4",
                          fontWeight: notification.read ? "400" : "500"
                        }}>
                          {notification.message}
                        </p>

                        {/* Alternative time */}
                        {notification.alternativeTime && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            margin: "6px 0",
                            padding: "4px 8px",
                            background: "#e7f3ff",
                            borderRadius: "6px",
                            fontSize: "12px",
                            color: "#0066cc"
                          }}>
                            <Clock size={12} />
                            Alternative time: {notification.alternativeTime}
                          </div>
                        )}

                        {/* Admin note */}
                        {notification.adminNote && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            margin: "6px 0",
                            padding: "4px 8px",
                            background: "#fff7e6",
                            borderRadius: "6px",
                            fontSize: "12px",
                            color: "#b45309"
                          }}>
                            <MessageSquare size={12} />
                            Note: {notification.adminNote}
                          </div>
                        )}

                        {/* Footer */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "8px"
                        }}>
                          <span style={{
                            fontSize: "12px",
                            color: "#888"
                          }}>
                            {formatDate(notification.createdAt)}
                          </span>
                          
                          {notification.status && (
                            <span style={{
                              fontSize: "11px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: notification.status === 'approved' ? '#dcfce7' : '#fee2e2',
                              color: notification.status === 'approved' ? '#166534' : '#991b1b',
                              textTransform: "capitalize"
                            }}>
                              {notification.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes dropdownGrow {
            from { 
              transform: scaleY(0) translateY(-10px); 
              opacity: 0; 
            }
            to { 
              transform: scaleY(1) translateY(0); 
              opacity: 1; 
            }
          }
        `}
      </style>
    </>
  );
}