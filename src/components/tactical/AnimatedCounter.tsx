'use client';

import React, { useEffect, useRef } from 'react';
// @ts-ignore - animejs v4 export
import { animate } from 'animejs';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1200,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef({ val: 0 });

  useEffect(() => {
    if (!spanRef.current) return;

    const targetVal = value;
    if (typeof animate === 'function') {
      try {
        animate(countRef.current, {
          val: targetVal,
          duration: duration,
          ease: 'outExpo',
          onUpdate: () => {
            if (spanRef.current) {
              spanRef.current.textContent = `${prefix}${Math.floor(countRef.current.val)}${suffix}`;
            }
          },
        });
        return;
      } catch {
        // Fallback below
      }
    }

    // Direct fallback if SSR or animation completes
    if (spanRef.current) {
      spanRef.current.textContent = `${prefix}${targetVal}${suffix}`;
    }
  }, [value, duration, prefix, suffix]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
