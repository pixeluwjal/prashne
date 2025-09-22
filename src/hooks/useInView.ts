// hooks/useInView.ts
import { useState, useEffect, useRef, RefObject } from 'react';

export const useInView = <T extends HTMLElement>(): [RefObject<T>, boolean] => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Optional: Disconnect observer after it's visible once
          // observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isInView];
};