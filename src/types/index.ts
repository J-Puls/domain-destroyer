export type Coordinates2D = {
  x: number;
  y: number;
};

export type WeaponOptions = {
  animatedParticle: boolean;
  animationCount: number;
  fireRate: number;
  name: string;
  particleAnimationDuration: number;
  particleOffset: Coordinates2D;
  playSoundOn: number;
  spriteFrames: number;
  spriteH: number;
  spriteW: number;
  cursorOffset: Coordinates2D;
};

export type WeaponDetails = {
  game;
  options?: WeaponOptions;
  sfx: string[];
  sprites: { cursor: string; particles: string[]; staticParticles: string[] };
};
