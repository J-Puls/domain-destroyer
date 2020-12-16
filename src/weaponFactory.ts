import Weapon from "./Weapon";
import sprites from "./sprites";
import sounds from "./sounds";

const weaponData = {
  hammer: {
    name: "hammer",
    fireRate: 50,
    animatedParticle: true,
    particleOffset: -50,
    spriteFrames: 2,
    animationCount: 1,
  },
  machinegun: {
    name: "machinegun",
    fireRate: 100,
    animatedParticle: true,
    particleOffset: -150,
    spriteFrames: 3,
    animationCount: "infinite",
  },
};

export const weaponFactory = (game) => {
  const weaponsList = [] as Weapon[];

  for (const name of Object.keys(weaponData)) {
    weaponsList.push(
      new Weapon(game, sounds[name], sprites[name], weaponData[name])
    );
  }
  return weaponsList;
};

export default weaponFactory;
