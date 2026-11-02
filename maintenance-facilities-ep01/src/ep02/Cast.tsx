// Episode 02 supporting-cast reference sheet (same rig, proportions and lighting as Episode 01).
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {PerspectiveCamera} from 'three';
import {Character} from '../characters/Character';
import {CAST_EP02} from '../characters/specs';
import {Lighting} from '../Lighting';
import {loadFonts} from '../fonts';

loadFonts();
const Cam: React.FC = () => {
  const {camera} = useThree();
  camera.position.set(0, 1.25, 8.6);
  (camera as PerspectiveCamera).fov = 34;
  (camera as PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(0, 0.95, 0);
  return null;
};

export const CastSheet02: React.FC = () => {
  const {width, height} = useVideoConfig();
  const n = CAST_EP02.length;
  const sp = 1.02;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a3546 0%, #141a23 60%, #0b0e13 100%)', fontFamily: '"Inter", sans-serif'}}>
      <ThreeCanvas width={width} height={height} shadows>
        <Cam />
        <Lighting keyPos={[3, 8, 6]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[7, 64]} />
          <meshStandardMaterial color="#3a414b" roughness={0.85} />
        </mesh>
        {CAST_EP02.map((c, i) => (
          <Character key={c.id} spec={c} action="idle" t={0.6 + i} position={[-((n - 1) * sp) / 2 + i * sp, 0, 0]} rotationY={-0.2} />
        ))}
      </ThreeCanvas>
      <div style={{position: 'absolute', left: 70, top: 44, color: '#eef3f8'}}>
        <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 18, letterSpacing: 4, color: '#e8771e'}}>EPISODE 02 · PRE-PRODUCTION · WATAK SOKONGAN</div>
        <div style={{fontSize: 40, fontWeight: 800, marginTop: 6}}>Rig, kadar badan &amp; pencahayaan sama seperti Episode 01</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center'}}>
        {CAST_EP02.map((c) => (
          <div key={c.id} style={{width: 200, textAlign: 'center', color: '#eef3f8'}}>
            <div style={{fontWeight: 800, fontSize: 15}}>{c.role}</div>
            <div style={{fontSize: 12, color: '#aab6c4', marginTop: 3, padding: '0 6px', lineHeight: 1.3}}>{c.roleMs}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', right: 60, top: 56, fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#aab6c4', textAlign: 'right', lineHeight: 1.6}}>
        Warna uniform & helmet jabatan lain: PLACEHOLDER (sila sahkan)
        <br />
        PPC & QMS: tanpa helmet di pejabat, berhelmet di lantai kilang
      </div>
    </AbsoluteFill>
  );
};
