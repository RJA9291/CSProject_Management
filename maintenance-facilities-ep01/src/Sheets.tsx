// Phase 2 character reference sheets (stills) and turntable (video).
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {PerspectiveCamera} from 'three';
import {Character} from './characters/Character';
import {Action, ROLE_ACTIONS} from './characters/poses';
import {byId, CHARACTERS, CharacterSpec} from './characters/specs';
import {Lighting} from './Lighting';
import {loadFonts} from './fonts';

loadFonts();

const font = '"Inter", system-ui, sans-serif';
const mono = '"JetBrains Mono", monospace';
const ORANGE = '#e8771e';

const Cam: React.FC<{pos: [number, number, number]; look: [number, number, number]; fov: number}> = ({pos, look, fov}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  (camera as PerspectiveCamera).fov = fov;
  (camera as PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(...look);
  return null;
};

const Floor: React.FC<{r?: number}> = ({r = 4}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <circleGeometry args={[r, 64]} />
    <meshStandardMaterial color="#3a414b" roughness={0.85} />
  </mesh>
);

export const SIGNATURE: Record<string, Action> = {
  manager: 'lead',
  engineer: 'present',
  assistant: 'clipboard',
  electrical: 'measure',
  mechanical: 'toolWork',
  welding: 'weld',
};

const ACTION_MS: Record<Action, string> = {
  idle: 'Berdiri',
  walk: 'Berjalan',
  lead: 'Memimpin',
  present: 'Menerangkan / menunjuk',
  tablet: 'Menyemak tablet',
  clipboard: 'Menanda checklist',
  inspect: 'Pemeriksaan visual',
  toolWork: 'Kerja hands-on',
  measure: 'Pengukuran elektrik',
  weld: 'Kimpalan',
};

const NOT_ALLOWED: Record<string, string> = {
  manager: 'Kerja pembaikan fizikal, memegang alat',
  engineer: 'Kerja pembaikan fizikal secara hands-on',
  assistant: 'Tool belt, memegang alat, membaiki secara fizikal',
  electrical: 'Kerja elektrik tanpa sarung tangan bertebat',
  mechanical: 'Kerja tanpa sarung tangan / cermin mata keselamatan',
  welding: 'Mengimpal tanpa perisai kimpalan diturunkan',
};

const ACC_MS: Record<string, string> = {
  tablet: 'Tablet',
  clipboard: 'Clipboard & pen',
  file: 'Fail',
  drawingRoll: 'Gulungan lukisan teknikal',
  lanyard: 'Lanyard & kad ID',
  toolBelt: 'Tool belt',
  multimeter: 'Multimeter',
  insulatedGloves: 'Sarung tangan bertebat',
  wrench: 'Sepana',
  workGloves: 'Sarung tangan kerja',
  weldingShield: 'Perisai kimpalan (flip-up)',
  leatherApron: 'Apron kulit',
  safetyGlasses: 'Cermin mata keselamatan',
  glasses: 'Cermin mata',
};

const Swatch: React.FC<{c: string; label: string}> = ({c, label}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: '#c9d3df'}}>
    <div style={{width: 26, height: 26, borderRadius: 6, background: c, border: '1px solid rgba(255,255,255,0.2)'}} />
    <span>{label}</span>
    <span style={{fontFamily: mono, fontSize: 13, color: '#7f8b9a'}}>{c}</span>
  </div>
);

/** One character's full reference sheet. */
export const CharacterSheetPage: React.FC<{id: string}> = ({id}) => {
  const spec = byId(id);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + 0.6;
  const views = [
    {rot: 0, label: 'DEPAN'},
    {rot: -Math.PI / 4, label: '3/4'},
    {rot: -Math.PI / 2, label: 'SISI'},
    {rot: Math.PI, label: 'BELAKANG'},
  ];
  const sig = SIGNATURE[id];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg, #1d2633 0%, #11161e 60%, #0b0e13 100%)', fontFamily: font, color: '#eef3f8'}}>
      {/* header */}
      <div style={{position: 'absolute', left: 56, top: 36}}>
        <div style={{fontFamily: mono, fontSize: 16, letterSpacing: 4, color: ORANGE}}>FASA 2 · CHARACTER REFERENCE · {String(CHARACTERS.indexOf(spec) + 1).padStart(2, '0')}/06</div>
        <div style={{fontSize: 44, fontWeight: 800, marginTop: 4}}>{spec.role}</div>
        <div style={{fontSize: 19, color: '#aab6c4', marginTop: 2}}>{spec.roleMs}</div>
      </div>

      {/* turnaround */}
      <div style={{position: 'absolute', left: 30, top: 150, width: 1160, height: 760, borderRadius: 18, background: 'rgba(255,255,255,0.03)', overflow: 'hidden'}}>
        <ThreeCanvas width={1160} height={760} shadows>
          <Cam pos={[0, 1.0, 7.4]} look={[0, 0.92, 0]} fov={22} />
          <Lighting keyPos={[3, 8, 6]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[12, 6]} />
            <meshStandardMaterial color="#353c46" roughness={0.9} />
          </mesh>
          {views.map((v, i) => (
            <Character key={i} spec={spec} action="idle" t={0.6} position={[-1.65 + i * 1.1, 0, 0]} rotationY={v.rot} />
          ))}
        </ThreeCanvas>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'space-around', fontFamily: mono, fontSize: 15, letterSpacing: 3, color: '#8f9bab'}}>
          {views.map((v) => (
            <span key={v.label}>{v.label}</span>
          ))}
        </div>
        <div style={{position: 'absolute', left: 20, top: 16, fontFamily: mono, fontSize: 14, letterSpacing: 3, color: '#8f9bab'}}>TURNAROUND</div>
      </div>

      {/* face close-up */}
      <div style={{position: 'absolute', left: 1210, top: 150, width: 330, height: 370, borderRadius: 18, background: 'rgba(255,255,255,0.03)', overflow: 'hidden'}}>
        <ThreeCanvas width={330} height={370}>
          <Cam pos={[0.45, spec.height * 0.93 + 0.04, 1.45]} look={[0, spec.height * 0.925, 0]} fov={22} />
          <Lighting keyPos={[2, 4, 4]} />
          <Character spec={spec} action="idle" t={0.6} rotationY={0} />
        </ThreeCanvas>
        <div style={{position: 'absolute', left: 16, top: 12, fontFamily: mono, fontSize: 13, letterSpacing: 3, color: '#8f9bab'}}>WAJAH</div>
      </div>

      {/* signature action */}
      <div style={{position: 'absolute', left: 1560, top: 150, width: 330, height: 370, borderRadius: 18, background: 'rgba(255,255,255,0.03)', overflow: 'hidden'}}>
        <ThreeCanvas width={330} height={370} shadows>
          <Cam pos={[2.0, 1.3, 3.3]} look={[0, 0.85, 0]} fov={36} />
          <Lighting keyPos={[3, 6, 4]} />
          <Floor r={2} />
          <Character spec={spec} action={sig} t={t} rotationY={0.4} />
        </ThreeCanvas>
        <div style={{position: 'absolute', left: 16, top: 12, fontFamily: mono, fontSize: 13, letterSpacing: 3, color: '#8f9bab'}}>AKSI KHAS</div>
        <div style={{position: 'absolute', left: 16, bottom: 12, fontSize: 16, fontWeight: 700}}>{ACTION_MS[sig]}</div>
      </div>

      {/* spec panel */}
      <div style={{position: 'absolute', left: 1210, top: 540, width: 680, height: 370, borderRadius: 18, background: 'rgba(255,255,255,0.04)', padding: '22px 26px', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        <div>
          <div style={{fontFamily: mono, fontSize: 13, letterSpacing: 3, color: ORANGE, marginBottom: 10}}>PALET</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <Swatch c={spec.shirt} label={spec.id === 'manager' ? 'Kemeja korporat' : 'Uniform department'} />
            <Swatch c={spec.shirtAccent} label="Aksen" />
            <Swatch c={spec.trousers} label="Seluar" />
            <Swatch c={spec.helmet} label="Helmet" />
            <Swatch c={spec.skin} label="Kulit" />
          </div>
        </div>
        <div>
          <div style={{fontFamily: mono, fontSize: 13, letterSpacing: 3, color: ORANGE, marginBottom: 10}}>AKSESORI TETAP</div>
          <div style={{fontSize: 16, lineHeight: 1.55, color: '#dbe3ec'}}>
            {spec.accessories.map((a) => (
              <div key={a}>• {ACC_MS[a]}</div>
            ))}
            {!spec.accessories.includes('toolBelt') && <div style={{color: '#8f9bab'}}>• Tiada tool belt</div>}
          </div>
        </div>
        <div style={{gridColumn: '1 / 3', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, fontSize: 15, lineHeight: 1.5}}>
          <div>
            <span style={{fontFamily: mono, fontSize: 12, letterSpacing: 2, color: '#3ddc84'}}>AKSI DIBENARKAN </span>
            {(ROLE_ACTIONS[id] ?? []).map((a) => ACTION_MS[a]).join(' · ')}
          </div>
          <div style={{marginTop: 4}}>
            <span style={{fontFamily: mono, fontSize: 12, letterSpacing: 2, color: '#ff6b6b'}}>TIDAK DIBENARKAN </span>
            {NOT_ALLOWED[id]}
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 56, bottom: 30, fontSize: 14, color: '#6f7b8a'}}>
        Warna uniform, kod helmet dan logo ialah placeholder (cadangan) sehingga disahkan. Model dijana daripada src/characters/specs.ts, jadi rupa watak sama dalam setiap scene.
      </div>
    </AbsoluteFill>
  );
};

/** Assistant Engineer vs Technician: the key differentiation required by the brief. */
export const AeVsTechnician: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + 0.6;
  const ae = byId('assistant');
  const tech = byId('mechanical');
  const rows: [string, string, string][] = [
    ['Uniform', 'Uniform department (sama)', 'Uniform department (sama)'],
    ['Helmet', 'Biru', 'Kuning'],
    ['Di tangan', 'Clipboard / tablet, pen', 'Alat kerja (sepana, multimeter, torch)'],
    ['Tali pinggang', 'Tiada tool belt', 'Tool belt dengan pouch'],
    ['Sarung tangan', 'Tidak', 'Ya'],
    ['Pergerakan', 'Tegak, memerhati, menanda', 'Membongkok, menjangkau, hands-on'],
    ['Lokasi', 'Tepi kawasan kerja / pejabat', 'Di dalam kawasan peralatan'],
  ];
  const Panel: React.FC<{spec: CharacterSpec; action: Action; x: number; title: string; color: string}> = ({spec, action, x, title, color}) => (
    <div style={{position: 'absolute', left: x, top: 150, width: 560, height: 700, borderRadius: 18, background: 'rgba(255,255,255,0.03)', overflow: 'hidden'}}>
      <ThreeCanvas width={560} height={700} shadows>
        <Cam pos={[1.9, 1.35, 3.4]} look={[0, 0.85, 0]} fov={32} />
        <Lighting keyPos={[3, 7, 5]} />
        <Floor r={3} />
        <Character spec={spec} action={action} t={t} rotationY={0.35} />
      </ThreeCanvas>
      <div style={{position: 'absolute', left: 20, top: 16, fontSize: 26, fontWeight: 800, color}}>{title}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg, #1d2633 0%, #11161e 60%, #0b0e13 100%)', fontFamily: font, color: '#eef3f8'}}>
      <div style={{position: 'absolute', left: 56, top: 36}}>
        <div style={{fontFamily: mono, fontSize: 16, letterSpacing: 4, color: ORANGE}}>FASA 2 · PEMBEZAAN PERANAN</div>
        <div style={{fontSize: 42, fontWeight: 800, marginTop: 4}}>Assistant Engineer lwn Technician</div>
      </div>
      <Panel spec={ae} action="clipboard" x={40} title="ASSISTANT ENGINEER" color="#6fa8ff" />
      <Panel spec={tech} action="toolWork" x={620} title="TECHNICIAN" color="#f2c230" />
      <div style={{position: 'absolute', left: 1210, top: 150, width: 670}}>
        <div style={{display: 'grid', gridTemplateColumns: '150px 1fr 1fr', fontSize: 17}}>
          <div />
          <div style={{fontFamily: mono, fontSize: 13, letterSpacing: 2, color: '#6fa8ff', padding: '10px 12px'}}>ASSISTANT ENGINEER</div>
          <div style={{fontFamily: mono, fontSize: 13, letterSpacing: 2, color: '#f2c230', padding: '10px 12px'}}>TECHNICIAN</div>
          {rows.map(([k, a, b], i) => (
            <React.Fragment key={k}>
              <div style={{padding: '14px 12px', color: '#8f9bab', background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.03)'}}>{k}</div>
              <div style={{padding: '14px 12px', background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.03)'}}>{a}</div>
              <div style={{padding: '14px 12px', background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.03)'}}>{b}</div>
            </React.Fragment>
          ))}
        </div>
        <div style={{marginTop: 26, fontSize: 16, lineHeight: 1.5, color: '#aab6c4'}}>
          Peraturan ini dikuatkuasakan dalam kod. Komponen watak menolak aksi yang tidak dibenarkan bagi sesuatu jawatan. Contohnya,
          Assistant Engineer tidak boleh dipaparkan membuat kerja pembaikan.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Turntable of the full cast (video). */
export const Turntable: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const ang = (frame / durationInFrames) * Math.PI * 2;
  const n = CHARACTERS.length;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a3546 0%, #141a23 60%, #0b0e13 100%)', fontFamily: font}}>
      <ThreeCanvas width={width} height={height} shadows>
        <Cam pos={[Math.sin(ang) * 7.5, 2.0, Math.cos(ang) * 7.5]} look={[0, 0.95, 0]} fov={34} />
        <Lighting keyPos={[4, 9, 6]} />
        <Floor r={6} />
        {CHARACTERS.map((c, i) => {
          const a = (i / n) * Math.PI * 2;
          return <Character key={c.id} spec={c} action={SIGNATURE[c.id]} t={t + i} position={[Math.sin(a) * 2.3, 0, Math.cos(a) * 2.3]} rotationY={a} />;
        })}
      </ThreeCanvas>
      <div style={{position: 'absolute', left: 56, top: 36, fontFamily: mono, fontSize: 16, letterSpacing: 4, color: ORANGE}}>FASA 2 · TURNTABLE · PASUKAN MAINTENANCE &amp; FACILITIES</div>
    </AbsoluteFill>
  );
};
