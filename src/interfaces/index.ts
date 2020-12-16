export interface WeaponObject {
  name: string;
  sfx: string[];
  sprites: { cursor: string; particles: string[]; staticParticles: string[] };
}

export interface Sprite {
  spawn: Function;
  spriteRenderer: HTMLDivElement;
  viewFrame: HTMLDivElement;
}
