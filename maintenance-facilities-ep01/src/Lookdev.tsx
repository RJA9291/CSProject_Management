import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {PerspectiveCamera} from 'three';
import {useThree} from '@react-three/fiber';
import {Character} from './characters/Character';
import {CHARACTERS, HELMET} from './characters/specs';
import {Factory} from './environment/Factory';
import {Lighting} from './Lighting';
import {loadFonts} from './fonts';

loadFonts();

const CameraRig: React.FC<{pos: [number, number, number]; look: [number, number, number]; fov?: number}> = ({pos, look, fov = 35}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  (camera as PerspectiveCamera).fov = fov;
  (camera as PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(...look);
  return null;
};

const font = '"Inter", system-ui, sans-serif';
const mono = '"JetBrains Mono", monospace';

/** Character reference sheet: the six characters side by side, front three-quarter view. */
export const CharacterLineup: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const t = frame / fps;
  const spacing = 1.05;
  const x0 = -((CHARACTERS.length - 1) * spacing) / 2;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a3546 0%, #141a23 60%, #0b0e13 100%)'}}>
      <ThreeCanvas width={width} height={height} shadows linear={false}>
        <CameraRig pos={[0, 1.3, 5.6]} look={[0, 1.0, 0]} fov={36} />
        <Lighting keyPos={[3, 8, 6]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[6, 64]} />
          <meshStandardMaterial color="#3a414b" roughness={0.8} />
        </mesh>
        {CHARACTERS.map((c, i) => (
          <Character key={c.id} spec={c} position={[x0 + i * spacing, 0, 0]} rotationY={-0.25} t={t + i} />
        ))}
      </ThreeCanvas>
      <div style={{position: 'absolute', left: 70, top: 46, fontFamily: font, color: '#eef3f8'}}>
        <div style={{fontFamily: mono, fontSize: 18, letterSpacing: 4, color: '#e8771e'}}>FASA 1 · CHARACTER REFERENCE SHEET</div>
        <div style={{fontSize: 40, fontWeight: 800, marginTop: 6}}>Maintenance &amp; Facilities · Watak Utama</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 36, display: 'flex', justifyContent: 'center', gap: 0}}>
        {CHARACTERS.map((c) => (
          <div key={c.id} style={{width: 300, textAlign: 'center', fontFamily: font, color: '#eef3f8'}}>
            <div style={{fontWeight: 800, fontSize: 19, letterSpacing: 1}}>{c.role}</div>
            <div style={{fontSize: 14, color: '#aab6c4', marginTop: 4, padding: '0 14px', lineHeight: 1.3}}>{c.roleMs}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', right: 60, top: 54, fontFamily: mono, fontSize: 14, color: '#aab6c4', textAlign: 'right', lineHeight: 1.6}}>
        <span style={{color: HELMET.management}}>■</span> Helmet putih: Manager, Engineer<br />
        <span style={{color: HELMET.assistant}}>■</span> Helmet biru: Assistant Engineer<br />
        <span style={{color: HELMET.technician}}>■</span> Helmet kuning: Technician<br />
        <span style={{color: '#e8771e'}}>(cadangan – sila sahkan)</span>
      </div>
    </AbsoluteFill>
  );
};

/** Environment reference: production hall with robotic body-in-white line. */
export const FactoryLookdev: React.FC<{cam?: 'wide' | 'aerial' | 'workshop'}> = ({cam = 'wide'}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const t = frame / fps;
  const cams = {
    wide: {pos: [-14, 3.2, 9] as [number, number, number], look: [2, 1.2, 0] as [number, number, number], fov: 42},
    aerial: {pos: [-26, 30, 30] as [number, number, number], look: [2, 0, -2] as [number, number, number], fov: 45},
    workshop: {pos: [15.2, 1.7, -9.2] as [number, number, number], look: [12.2, 1.2, -14.4] as [number, number, number], fov: 42},
  }[cam];
  return (
    <AbsoluteFill style={{background: '#1a2230'}}>
      <ThreeCanvas width={width} height={height} shadows>
        <color attach="background" args={['#1a2230']} />
        <fog attach="fog" args={['#2a3445', 18, 70]} />
        <CameraRig {...cams} />
        <Lighting keyPos={[10, 20, 12]} />
        <Factory t={t} cutaway={cam === 'aerial'} />
        {cam === 'wide' && (
          <>
            <Character spec={CHARACTERS[3]} position={[-6, 0, 5.2]} rotationY={0.9} t={t} />
            <Character spec={CHARACTERS[2]} position={[-7.2, 0, 6.0]} rotationY={0.6} t={t} />
          </>
        )}
        {cam === 'workshop' && (
          <>
            <Character spec={CHARACTERS[3]} position={[11.6, 0, -13.5]} rotationY={0.5} t={t} />
            <Character spec={CHARACTERS[2]} position={[13.5, 0, -12.7]} rotationY={-0.9} t={t} />
          </>
        )}
      </ThreeCanvas>
      <div style={{position: 'absolute', left: 60, top: 40, fontFamily: mono, fontSize: 18, letterSpacing: 4, color: '#e8771e'}}>FASA 1 · ENVIRONMENT REFERENCE · {cam.toUpperCase()}</div>
    </AbsoluteFill>
  );
};
