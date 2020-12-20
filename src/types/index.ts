export type WeaponOptions = {
  animatedParticle: boolean;
  animationCount: number;
  fireRate: number;
  name: string;
  particleAnimationDuration: number;
  particleOffset: { x: number; y: number };
  spriteFrames: number;
};

export type WeaponDetails = {
  game;
  options?: WeaponOptions;
  sfx: string[];
  sprites: { cursor: string; particles: string[]; staticParticles: string[] };
};
