import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { socketService } from '../services/socketService';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated, token } = useAuthContext();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated && token && user) {
      // Connect to socket
      socketService.connect(token);
      
      // Set up event listeners
      socketService.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });

      socketService.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      // Expense-related events
      socketService.on('new_expense', (data) => {
        if (user.role === 'manager' || user.role === 'admin') {
          toast.success(`New expense submitted by ${data.submitter.name}`);
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'new_expense',
            message: `New expense submitted by ${data.submitter.name}`,
            data: data.expense,
            timestamp: new Date(),
            read: false,
          }]);
        }
      });

      socketService.on('expense_status_update', (data) => {
        if (data.userId === user.id) {
          const statusMessage = data.status === 'approved' ? 'approved' : 'rejected';
          toast.success(`Your expense has been ${statusMessage} by ${data.approver.name}`);
          
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'expense_status_update',
            message: `Your expense has been ${statusMessage} by ${data.approver.name}`,
            data,
            timestamp: new Date(),
            read: false,
          }]);
        }
      });

      // Approval-related events
      socketService.on('approval_reminder', (data) => {
        if (user.role === 'manager' || user.role === 'admin') {
          toast('Pending approvals require your attention', {
            icon: '⏰',
          });
          
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'approval_reminder',
            message: 'Pending approvals require your attention',
            data,
            timestamp: new Date(),
            read: false,
          }]);
        }
      });

      // System notifications
      socketService.on('system_notification', (data) => {
        toast(data.message, {
          icon: data.type === 'warning' ? '⚠️' : 'ℹ️',
        });
        
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'system_notification',
          message: data.message,
          data,
          timestamp: new Date(),
          read: false,
        }]);
      });

      // User activity events
      socketService.on('user_login', (data) => {
        if (user.role === 'admin') {
          console.log(`User ${data.userName} logged in`);
        }
      });

      socketService.on('user_logout', (data) => {
        if (user.role === 'admin') {
          console.log(`User ${data.userName} logged out`);
        }
      });

      return () => {
        socketService.disconnect();
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, token, user]);

  const emitEvent = (eventName, data) => {
    socketService.emit(eventName, data);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const value = {
    isConnected,
    notifications,
    unreadCount: getUnreadNotificationCount(),
    emitEvent,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};