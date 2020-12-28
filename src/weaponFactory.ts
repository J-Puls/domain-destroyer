import Weapon from "./Weapon";
import sprites from "./sprites";
import sounds from "./sounds";
import weaponData from "./weapons";

/** Compiles a list of weapon objects */
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
