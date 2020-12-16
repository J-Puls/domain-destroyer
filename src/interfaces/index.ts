export interface WeaponObject {
  name: string;
  sfx: string[];
  sprites: { cursor: string; particle: string[] };
}

export interface Sprite {
  spawn: Function;
  spriteRenderer: HTMLDivElement;
  viewFrame: HTMLDivElement;
}
