import { WeaponObject } from "./interfaces";
import ParticleGenerator from "./ParticleGenerator";
import { WeaponOptions, Coordinates2D, Dimensions2D } from "./types";
import { sleep } from "./utils/sleep";
import { Howl } from "howler";

export class Weapon implements WeaponObject {
  animatedParticle: boolean;
  animationCount: number;
  cursorOffset: Coordinates2D;
  damagePoints: number;
  fire: Function;
  fireRate: number;
  generateSoundEffect: Function;
  getStereoLocation: Function;
  name: string;
  particleAnimationDuration: number;
  particleGenerator: ParticleGenerator;
  particleOffset: Coordinates2D;
  particleSpriteDimensions: Dimensions2D;
  sfx: string[];
  spawn: Function;
  spriteFrames: number;
  spriteH: number;
  spriteRenderer: HTMLDivElement;
  spriteW: number;
  sprites: { cursor: string; particles: string[]; staticParticles: string[] };
  viewFrame: HTMLDivElement;

  constructor(game, sfx, sprites, options: WeaponOptions) {
    this.animatedParticle = options.animatedParticle || false;
    this.animationCount = options.animationCount || 1;
    this.fireRate = options.fireRate || 1;
    this.name = options.name;
    this.particleAnimationDuration = options.particleAnimationDuration || 0;
    this.particleOffset = { ...options.particleOffset } || { x: 0, y: 0 };
    this.sfx = sfx;
    this.spriteFrames = options.spriteFrames || 1;
    this.sprites = { ...sprites };
    this.spriteW = options.spriteW;
    this.spriteH = options.spriteH;
    this.damagePoints = options.damagePoints || 1;
    this.cursorOffset = options.cursorOffset || { x: 0, y: 0 };
    this.particleSpriteDimensions = options.particleSpritDimensions || {
      w: 150,
      h: 150,
    };
    this.particleGenerator = new ParticleGenerator(this, game);

    // create the sprite view frame
    this.viewFrame = document.createElement("div");
    this.viewFrame.id = "destroyer-weapon-sprite-view-frame";
    this.viewFrame.className = `destroyer-sprite weapon-sprite-view-frame`;

    // create the spritesheet renderer
    this.spriteRenderer = document.createElement("div");
    this.spriteRenderer.id = "destroyer-weapon-sprite-renderer";
    this.spriteRenderer.className = `destroyer-sprite weapon-sprite-renderer`;

    // pack the renderer into the view frame
    this.spawn = () => {
      this.viewFrame.appendChild(this.spriteRenderer);
      return this.viewFrame;
    };

    // fires a single shot
    this.fire = async () => {
      const coords = { ...game.mousePos }; // grab the current cursor position

      // generate the particles to be rendered
      const particle = this.particleGenerator.generate(coords);
      const aParticle = particle.getAnimatedContent();
      const sParticle = particle.getStaticContent();

      particle.playSoundEffect();

      game.particleLayer.appendChild(aParticle); // render the animated sprite

      // wait for the animation to finish, then remove the animated sprite
      await sleep(this.particleAnimationDuration);
      game.particleLayer.removeChild(aParticle);

      // replace the animated sprite with a persisted image on the canvas
      game.drawingCTX.drawImage(
        sParticle,
        coords.x + this.particleOffset.x - 75,
        coords.y + this.particleOffset.y - 75
      );
      game.pageHealth -= this.damagePoints; // decrement page health by weapon's damage value
      game.onDamage();
    };
  }
}

export default Weapon;
