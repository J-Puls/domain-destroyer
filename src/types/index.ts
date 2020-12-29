export type Coordinates2D = {
  x: number;
  y: number;
};

export type Dimensions2D = {
  w: number;
  h: number;
};

export type WeaponOptions = {
  animatedParticle: boolean;
  animationCount: number;
  cursorOffset: Coordinates2D;
  damagePoints: number;
  fireRate: number;
  name: string;
  particleAnimationDuration: number;
  particleOffset: Coordinates2D;
  particleSpritDimensions: Dimensions2D;
  playSoundOn: number;
  spriteFrames: number;
  spriteH: number;
  spriteW: number;
};

export type DestroyerOptions = {
  defaultVolume: number;
  onDamage: Function;
  pageHealth: number;
  particleLimit: number;
  volumeChangeDelta: number;
  zIndexStart: number;
};
