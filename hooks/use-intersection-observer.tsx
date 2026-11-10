import { useState, useEffect, useRef } from "react";

export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.MutableRefObject<HTMLDivElement | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { threshold = 0.01, rootMargin = "120px 0px", root = null } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasAnimated(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasAnimated, threshold, rootMargin, root]);

  return [ref, isIntersecting];
}
