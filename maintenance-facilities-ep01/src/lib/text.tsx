// Text rendered onto canvas textures (signs, screens, documents) with the project fonts.
import React, {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {CanvasTexture, SRGBColorSpace} from 'three';

/** Holds the frame until the web fonts are ready, so textures use Inter, not a fallback. */
export const useFontsReady = () => {
  const [ready, setReady] = useState(typeof document !== 'undefined' && document.fonts.status === 'loaded');
  const [handle] = useState(() => (ready ? null : delayRender('fonts for canvas textures')));
  useEffect(() => {
    if (ready) return;
    Promise.all([document.fonts.load('800 40px Inter'), document.fonts.load('600 40px Inter'), document.fonts.load('700 40px "JetBrains Mono"')])
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        if (handle !== null) continueRender(handle);
      });
  }, [ready, handle]);
  return ready;
};

export type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

/** Creates (once) a canvas texture of size w×h drawn by `draw`. */
export const useCanvasTexture = (key: string, w: number, h: number, draw: Draw) => {
  const ready = useFontsReady();
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d')!;
    draw(ctx, w, h);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ready]);
};

/** A flat panel showing a canvas texture. */
export const TexPlane: React.FC<{
  id: string;
  w: number;
  h: number;
  px?: number; // pixels per metre
  draw: Draw;
  position?: [number, number, number];
  rotation?: [number, number, number];
  emissive?: number;
  opacity?: number;
  alpha?: boolean; // canvas has transparent areas
}> = ({id, w, h, px = 400, draw, position = [0, 0, 0], rotation = [0, 0, 0], emissive = 0, opacity = 1, alpha = false}) => {
  const tex = useCanvasTexture(id, Math.round(w * px), Math.round(h * px), draw);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={tex} emissiveMap={tex} emissive={emissive ? '#ffffff' : '#000000'} emissiveIntensity={emissive} transparent={alpha || opacity < 1} alphaTest={alpha ? 0.02 : 0} opacity={opacity} depthWrite={!alpha} roughness={0.6} toneMapped={!emissive} />
    </mesh>
  );
};

export const FONT = '"Inter", system-ui, sans-serif';
export const MONO = '"JetBrains Mono", monospace';
