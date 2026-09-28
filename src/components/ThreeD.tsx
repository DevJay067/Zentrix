import { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

export default function ThreeD() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const splineApp = new Application(canvasRef.current);

    splineApp.load('/carex.splinecode').catch((err: Error) => {
      console.error('Error loading spline file:', err);
    });

    return () => {
      splineApp.dispose();
    };
  }, []);

  return (
    <div className='dmodel' style={{ width: '100' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
