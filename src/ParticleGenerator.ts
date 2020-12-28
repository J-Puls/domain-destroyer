import Particle from "./Particle";

export class ParticleGenerator {
  generate: Function;

  constructor(weapon, game) {
    // returns the elements to render a particle
    this.generate = (coords) => {
      const particleNumber = Math.floor(
        Math.random() * weapon.sprites.particles.length
      );

      const sprites = {
        animated: weapon.sprites.particles[particleNumber],
        static: weapon.sprites.staticParticles[particleNumber],
      };

      return new Particle(
        game.parent.clientWidth,
        weapon.particleSpriteDimensions,
        coords,
        weapon.particleOffset,
        `${weapon.sfx[Math.floor(Math.random() * weapon.sfx.length)]}`,
        sprites
      );
    };
  }
}

export default ParticleGenerator;
