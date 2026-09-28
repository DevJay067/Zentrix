import { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

export default function ThreeD() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Guard against environments or browsers where WebGL is unsupported or disabled
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('[ThreeD] WebGL not supported or disabled on this device.');
        return;
      }
    } catch {
      return;
    }

    let splineApp: Application | null = null;
    try {
      splineApp = new Application(canvasRef.current);
      splineApp.load('/carex.splinecode').catch((err: any) => {
        console.warn('Notice: Spline 3D asset optional or not loaded:', err?.message || err);
      });
    } catch (e: any) {
      console.warn('[ThreeD] Spline runtime initialization warning:', e?.message || e);
    }

    return () => {
      try {
        splineApp?.dispose();
      } catch {}
    };
  }, []);

  return (
    <div className='dmodel' style={{ width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
