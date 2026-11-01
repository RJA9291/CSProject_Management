// Pose & action library. Every action is tied to a role in ROLE_ACTIONS, so a scene
// cannot accidentally show an Assistant Engineer doing hands-on repair work.

export type ArmPose = {pitch: number; roll: number; elbow: number}; // radians; negative pitch = forward
export type LegPose = {hip: number; knee: number};

export type Pose = {
  spine: number; // forward bend
  twist: number; // torso yaw
  headPitch: number;
  headYaw: number;
  l: ArmPose;
  r: ArmPose;
  ll: LegPose;
  rl: LegPose;
  drop: number; // pelvis drop (m) for crouch / walk bob
  shieldDown?: boolean;
};

export type Action = 'idle' | 'walk' | 'lead' | 'tablet' | 'clipboard' | 'inspect' | 'toolWork' | 'measure' | 'weld' | 'present';

const arm = (pitch: number, elbow: number, roll = 0.08): ArmPose => ({pitch, roll, elbow});
const leg = (hip = 0, knee = 0): LegPose => ({hip, knee});

const base = (): Pose => ({
  spine: 0,
  twist: 0,
  headPitch: 0,
  headYaw: 0,
  l: arm(0.04, -0.12),
  r: arm(0.04, -0.12),
  ll: leg(),
  rl: leg(),
  drop: 0,
});

/** Returns the pose for an action at time t (seconds). */
export const poseFor = (action: Action, t: number): Pose => {
  const p = base();
  const s = Math.sin;
  switch (action) {
    case 'idle':
      p.headYaw = 0.08 * s(t * 0.5);
      p.l = arm(0.04 + 0.02 * s(t), -0.15);
      p.r = arm(0.04 - 0.02 * s(t), -0.15);
      break;
    case 'walk': {
      const c = t * 5.2;
      p.ll = leg(0.42 * s(c), Math.max(0, -0.7 * s(c + 1.3)) + 0.05);
      p.rl = leg(-0.42 * s(c), Math.max(0, 0.7 * s(c + 1.3)) + 0.05);
      p.l = arm(-0.35 * s(c), -0.3);
      p.r = arm(0.35 * s(c), -0.3);
      p.drop = 0.025 * Math.abs(s(c));
      p.spine = 0.04;
      break;
    }
    case 'lead': // manager: tablet in left hand, open right-hand gesture
      p.l = arm(-0.3, -1.1);
      p.r = arm(-0.55 + 0.12 * s(t * 1.3), -0.7, 0.35);
      p.headYaw = 0.15 * s(t * 0.4);
      break;
    case 'present': // explaining / pointing at a screen or drawing
      p.l = arm(-0.3, -1.15);
      p.r = arm(-1.25 + 0.06 * s(t * 2), -0.15, 0.25);
      p.twist = 0.15;
      p.headYaw = 0.25;
      break;
    case 'tablet':
      p.l = arm(-0.38, -1.2);
      p.r = arm(-0.32, -1.1);
      p.headPitch = 0.3;
      p.r.elbow += 0.05 * s(t * 3); // swiping
      break;
    case 'clipboard': // AE: hold clipboard, right hand writes / ticks
      p.l = arm(-0.32, -1.25);
      p.r = arm(-0.42 + 0.04 * s(t * 6), -1.0 + 0.06 * s(t * 9));
      p.headPitch = 0.32;
      break;
    case 'inspect': // AE / engineer: visual inspection, looking and pointing, no tools
      p.spine = 0.12;
      p.headPitch = 0.15;
      p.headYaw = 0.2 * s(t * 0.6);
      p.l = arm(-0.32, -1.25);
      p.r = arm(-0.9 + 0.05 * s(t), -0.2, 0.2);
      break;
    case 'toolWork': // technician: hands-on, leaning in with both hands forward
      p.spine = 0.38;
      p.headPitch = 0.25;
      p.l = arm(-0.85, -0.6 + 0.08 * s(t * 4));
      p.r = arm(-0.95 + 0.12 * s(t * 4), -0.5);
      p.ll = leg(-0.1, 0.12);
      p.rl = leg(0.15, 0.12);
      break;
    case 'measure': // electrical technician: probe + meter
      p.spine = 0.22;
      p.headPitch = 0.3;
      p.l = arm(-0.55, -1.0);
      p.r = arm(-1.05 + 0.04 * s(t * 2), -0.35);
      break;
    case 'weld': // welding technician: crouched, torch forward, shield down
      p.spine = 0.3;
      p.headPitch = 0.35;
      p.ll = leg(-0.75, 1.4);
      p.rl = leg(-0.5, 1.15);
      p.drop = 0.2;
      p.l = arm(-0.8, -0.5);
      p.r = arm(-0.95 + 0.03 * s(t * 3), -0.45);
      p.shieldDown = true;
      break;
  }
  return p;
};

/** Actions each role may perform on screen (enforced by <Character>). */
export const ROLE_ACTIONS: Record<string, Action[]> = {
  manager: ['idle', 'walk', 'lead', 'present', 'tablet'],
  engineer: ['idle', 'walk', 'tablet', 'present', 'inspect'],
  assistant: ['idle', 'walk', 'clipboard', 'tablet', 'inspect'],
  electrical: ['idle', 'walk', 'measure', 'toolWork', 'inspect'],
  mechanical: ['idle', 'walk', 'toolWork', 'inspect'],
  welding: ['idle', 'walk', 'weld', 'toolWork'],
};
