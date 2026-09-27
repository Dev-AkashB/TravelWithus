import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const NotificationToast = () => {
  const { activeToast } = useNotifications();

  if (!activeToast) return null;

  const isConfirmed = activeToast.eventType?.includes('CONFIRMED') || activeToast.eventType?.includes('SUCCESS');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '420px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${isConfirmed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(20, 184, 166, 0.4)'}`,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(20, 184, 166, 0.2)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isConfirmed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(20, 184, 166, 0.2)',
          color: isConfirmed ? '#34d399' : '#2dd4bf',
          flexShrink: 0
        }}
      >
        {isConfirmed ? <CheckCircle2 size={20} /> : <Bell size={20} />}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
            {activeToast.title}
          </h4>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Just now</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4' }}>
          {activeToast.message}
        </p>
      </div>
    </div>
  );
};
