// Replace any file under public/audio/ with your own (same name) to swap audio.
export const SFX = {
  pop: 'audio/sfx/pop.wav',
  blip: 'audio/sfx/blip.wav',
  whoosh: 'audio/sfx/whoosh.wav',
  sparkle: 'audio/sfx/sparkle.wav',
  coin: 'audio/sfx/coin.wav',
  jump: 'audio/sfx/jump.wav',
  success: 'audio/sfx/success.wav',
  click: 'audio/sfx/click.wav',
  transition: 'audio/sfx/transition.wav',
  // Episode 03 additions.
  alert: 'audio/sfx/alert.wav',
  notify: 'audio/sfx/notify.wav',
  buzz: 'audio/sfx/buzz.wav',
  // Episode 04 addition.
  link: 'audio/sfx/link.wav',
  // Episode 05 addition.
  key: 'audio/sfx/key.wav',
  // Episode 06 addition.
  print: 'audio/sfx/print.wav',
} as const;

export type SfxName = keyof typeof SFX;

export const AUDIO = {
  music: 'audio/music/bgm.wav',
  musicVolume: 0.13,
  // Music volume while a voice-over line is playing.
  musicDuckedVolume: 0.055,
  voVolume: 1,
  sfxVolume: 0.32,
  transitionSfx: true,
  showSubtitles: true,
};
