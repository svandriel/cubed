import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';

export function useElementSize(el: HTMLElement | null | undefined): {
  width: number;
  height: number;
} {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (el !== null && typeof el !== 'undefined') {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width !== size.width || height !== size.height) {
        setSize({ width, height });
      }
    }
  }, [el, windowWidth, windowHeight, size]);

  return size;
}
