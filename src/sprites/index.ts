import hammer from "./hammer";
import hammerParticle from "./hammerParticles";
import machinegun from "./machinegun";
import machinegunParticle from "./machinegunParticles";
import staticSprites from "./staticSprites";

const sprites = {
  hammer: {
    cursor: hammer,
    particles: hammerParticle,
    staticParticles: staticSprites.hammer,
  },
  machinegun: {
    cursor: machinegun,
    particles: machinegunParticle,
    staticParticles: staticSprites.machinegun,
  },
};

export default sprites;
