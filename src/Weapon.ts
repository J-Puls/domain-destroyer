import { WeaponObject } from "./interfaces";
import ParticleGenerator from "./ParticleGenerator";
import { WeaponOptions } from "./types";
import { Howl } from "howler";

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export class Weapon implements WeaponObject {
  animatedParticle: boolean;
  animationCount: number;
  spriteRenderer: HTMLDivElement;
  fireRate: number;
  spawn: Function;
  name: string;
  particleOffset: { x: number; y: number };
  viewFrame: HTMLDivElement;
  sfx: string[];
  spriteFrames: number;
  sprites: { cursor: string; particles: string[]; staticParticles: string[] };
  particleAnimationDuration: number;
  particleGenerator: ParticleGenerator;
  generateParticle: Function;
  generateSoundEffect: Function;
  fire: Function;
  getStereoLocation: Function;
  constructor(game, sfx, sprites, options: WeaponOptions) {
    // instantiate object details
    this.animatedParticle = options.animatedParticle || false;
    this.animationCount = options.animationCount || 1;
    this.fireRate = options.fireRate || 1;
    this.name = options.name;
    this.particleAnimationDuration = options.particleAnimationDuration || 0;
    this.particleOffset = { ...options.particleOffset } || { x: 0, y: 0 };
    this.sfx = sfx;
    this.spriteFrames = options.spriteFrames || 1;
    this.sprites = { ...sprites };
    this.particleGenerator = new ParticleGenerator(game);

    // create the sprite view frame
    this.viewFrame = document.createElement("div");
    this.viewFrame.id = "destroyer-weapon-sprite-view-frame";
    this.viewFrame.className = `destroyer-sprite weapon-sprite-view-frame`;
    this.viewFrame.style.zIndex = `${game.zIndStart + 2}`;

    // create the spritesheet renderer
    this.spriteRenderer = document.createElement("div");
    this.spriteRenderer.id = "destroyer-weapon-sprite-renderer";
    this.spriteRenderer.className = `destroyer-sprite weapon-sprite-renderer`;
    this.spriteRenderer.style.zIndex = `${game.zIndStart + 3}`;

    // pack the renderer into the view frame
    this.spawn = () => {
      this.viewFrame.appendChild(this.spriteRenderer);
      return this.viewFrame;
    };

    // generate the animated and static particles to be rendered
    this.generateParticle = (coords) => {
      // pick a random particle sprite sheet
      const particleNumber = Math.floor(
        Math.random() * this.sprites.particles.length
      );

      // generate the elements to be rendered
      const staticParticle = new Image();
      staticParticle.src = this.sprites.staticParticles[particleNumber];

      const particle = this.particleGenerator.generate(
        this,
        particleNumber,
        coords
      );

      const particles = { animated: particle, static: staticParticle };

      return particles;
    };

    // calculate where the cursor sound is relative to the center of the viewport (-1 to 1)
    this.getStereoLocation = (coords) => {
      return (
        -(
          (Math.round(game.parent.clientWidth / 2) - coords.x) /
          game.parent.clientWidth
        ) * 2
      );
    };

    // creates a new sound effect instance

    this.generateSoundEffect = (coords) => {
      const stereo = this.getStereoLocation(coords);

      const sound = new Howl({
        src: [`${this.sfx[Math.floor(Math.random() * this.sfx.length)]}`],
        autoplay: true,
        stereo,
      });

      return sound;
    };

    // fires a single shot
    this.fire = async () => {
      // grab the current cursor position
      const coords = { ...game.mousePos };

      // generate the particles to be rendered
      const particle = this.generateParticle(coords);

      // generate the sound effect (must be done here to conform to browser autoplay rules)
      const sound = this.generateSoundEffect(coords);

      sound.play();
      if (this.animatedParticle) {
      }
      // render the animated sprite
      game.particleLayer.appendChild(particle.animated);

      // wait for the animation to finish, then remove the animated sprite
      await sleep(this.particleAnimationDuration);
      game.particleLayer.removeChild(particle.animated);

      // replace the animated sprite with a persisted image on the canvas
      game.drawingCTX.drawImage(
        particle.static,
        coords.x + this.particleOffset.x - 75,
        coords.y + this.particleOffset.y - 75
      );
    };
  }
}

export default Weapon;
