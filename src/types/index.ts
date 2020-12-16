export type WeaponOptions = {
  animatedParticle: boolean;
  animationCount: number;
  fireRate: number;
  name: string;
  particleOffset: number;
  spriteFrames: number;
};

export type WeaponDetails = {
  game;
  sfx: string[];
  sprites: { cursor: string; particle: string[] };
  options?: WeaponOptions;
};
