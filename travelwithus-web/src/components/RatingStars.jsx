import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, size = 16, showScore = true }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= Math.round(rating) ? '#f59e0b' : 'none'}
            stroke={star <= Math.round(rating) ? '#f59e0b' : '#64748b'}
          />
        ))}
      </div>
      {showScore && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginLeft: '4px' }}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};
