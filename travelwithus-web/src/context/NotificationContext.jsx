import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { api } from '../api/client';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to TravelWithUs',
      message: 'Explore hand-picked luxury tours and book with instant confirmation.',
      eventType: 'SYSTEM_ANNOUNCEMENT',
      readStatus: false,
      createdAt: new Date().toISOString()
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(1);
  const [activeToast, setActiveToast] = useState(null);

  // Fetch initial notifications
  useEffect(() => {
    if (user?.id) {
      api.getUserNotifications(user.id).then(list => {
        if (list && list.length > 0) {
          setNotifications(list);
          setUnreadCount(list.filter(n => !n.readStatus).length);
        }
      });
    }
  }, [user]);

  // STOMP WebSocket Connection
  useEffect(() => {
    let stompClient = null;

    try {
      stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          // Public alerts
          stompClient.subscribe('/topic/notifications', (message) => {
            try {
              const body = JSON.parse(message.body);
              handleIncomingNotification(body);
            } catch (err) {
              console.warn('STOMP parse error', err);
            }
          });

          // Announcements
          stompClient.subscribe('/topic/announcements', (message) => {
            try {
              const body = JSON.parse(message.body);
              handleIncomingNotification({
                id: Date.now(),
                title: body.title || 'Announcement',
                message: body.message,
                eventType: 'SYSTEM_ANNOUNCEMENT',
                readStatus: false,
                createdAt: new Date().toISOString()
              });
            } catch (err) {
              console.warn('STOMP parse error', err);
            }
          });

          // User-specific notifications
          if (user?.id) {
            stompClient.subscribe(`/topic/user-${user.id}`, (message) => {
              try {
                const body = JSON.parse(message.body);
                handleIncomingNotification(body);
              } catch (err) {
                console.warn('STOMP parse error', err);
              }
            });
          }
        },
        onStompError: (frame) => {
          console.debug('STOMP error, falling back to local simulator', frame);
        }
      });

      stompClient.activate();
    } catch {
      console.debug('WebSocket unavailable, running in local event mode');
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [user?.id]);

  const handleIncomingNotification = (notif) => {
    const formatted = {
      id: notif.id || Date.now(),
      title: notif.title || 'Travel Alert',
      message: notif.message,
      eventType: notif.eventType || 'SYSTEM_ANNOUNCEMENT',
      readStatus: false,
      createdAt: notif.createdAt || new Date().toISOString()
    };

    setNotifications(prev => [formatted, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show temporary toast notification
    setActiveToast(formatted);
    setTimeout(() => {
      setActiveToast(null);
    }, 5000);
  };

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, readStatus: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    await api.markNotificationRead(id);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
    setUnreadCount(0);
  };

  const triggerDemoNotification = (title, message, eventType = 'BOOKING_CONFIRMED') => {
    handleIncomingNotification({ title, message, eventType });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      activeToast,
      markAsRead,
      markAllAsRead,
      triggerDemoNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
