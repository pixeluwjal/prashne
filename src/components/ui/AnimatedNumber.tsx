// src/components/ui/AnimatedNumber.tsx
'use client';

import { useEffect, useState } from 'react';

export function AnimatedNumber({ value }: { value: number }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1000; // Animation duration in milliseconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCurrentValue(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return <span className="text-4xl font-bold text-gray-900">{currentValue.toLocaleString()}</span>;
}