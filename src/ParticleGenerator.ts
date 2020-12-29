import Particle from "./Particle";
import { Coordinates2D } from "./types";
import Weapon from "./Weapon";

export class ParticleGenerator {
  weapon: Weapon;
  game;
  constructor(weapon, game) {
    this.weapon = weapon;
    this.game = game;
  }

  /** Generate and return a particle object to be rendered at the given coordinates */
  generate(coords: Coordinates2D) {
    const particleNumber = Math.floor(
      Math.random() * this.weapon.sprites.particles.length
    );

    const sprites = {
      animated: this.weapon.sprites.particles[particleNumber],
      static: this.weapon.sprites.staticParticles[particleNumber],
    };

    return new Particle(
      this.game.parent.clientWidth,
      this.weapon.particleSpriteDimensions,
      coords,
      this.weapon.particleOffset,
      `${this.weapon.sfx[Math.floor(Math.random() * this.weapon.sfx.length)]}`,
      sprites
    );
  }
}

export default ParticleGenerator;
