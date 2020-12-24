import { WeaponObject } from "./interfaces";
import ParticleGenerator from "./ParticleGenerator";
import { WeaponOptions, Coordinates2D } from "./types";
import { sleep } from "./utils/sleep";
import { Howl } from "howler";

export class Weapon implements WeaponObject {
  animatedParticle: boolean;
  animationCount: number;
  spriteRenderer: HTMLDivElement;
  fireRate: number;
  spawn: Function;
  name: string;
  cursorOffset: Coordinates2D;
  particleOffset: Coordinates2D;
  viewFrame: HTMLDivElement;
  sfx: string[];
  spriteFrames: number;
  spriteW: number;
  spriteH: number;
  sprites: { cursor: string; particles: string[]; staticParticles: string[] };
  particleAnimationDuration: number;
  particleGenerator: ParticleGenerator;
  generateSoundEffect: Function;
  fire: Function;
  getStereoLocation: Function;

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
    this.cursorOffset = options.cursorOffset || { x: 0, y: 0 };
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
      // grab the current cursor position
      const coords = { ...game.mousePos };

      // generate the particles to be rendered
      const particle = this.particleGenerator.generate(coords);
      const aParticle = particle.getAnimatedContent();
      const sParticle = particle.getStaticContent();

      particle.playSoundEffect();

      if (this.animatedParticle) {
      }
      // render the animated sprite
      game.particleLayer.appendChild(aParticle);

      // wait for the animation to finish, then remove the animated sprite
      await sleep(this.particleAnimationDuration);
      game.particleLayer.removeChild(aParticle);

      // replace the animated sprite with a persisted image on the canvas
      game.drawingCTX.drawImage(
        sParticle,
        coords.x + this.particleOffset.x - 75,
        coords.y + this.particleOffset.y - 75
      );
    };
  }
}

export default Weapon;
