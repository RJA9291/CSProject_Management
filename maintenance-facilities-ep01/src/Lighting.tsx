import React from 'react';

/** Cinematic industrial light rig: cool blue sky fill, warm key, rim light, soft shadows. */
export const Lighting: React.FC<{keyPos?: [number, number, number]; intensity?: number}> = ({keyPos = [6, 12, 8], intensity = 1}) => (
  <>
    <hemisphereLight args={['#b9d4ff', '#2a2f37', 0.9 * intensity]} />
    <directionalLight
      position={keyPos}
      intensity={2.2 * intensity}
      color="#ffe2bf"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-20}
      shadow-camera-right={20}
      shadow-camera-top={20}
      shadow-camera-bottom={-20}
      shadow-bias={-0.0004}
    />
    <directionalLight position={[-8, 6, -10]} intensity={1.3 * intensity} color="#6fa8ff" />
    <pointLight position={[0, 3, 4]} intensity={6 * intensity} distance={14} color="#ffb070" />
  </>
);
