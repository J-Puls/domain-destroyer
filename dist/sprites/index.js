import hammer from "./hammer";
import hammerParticles from "./hammerParticles";
import machinegun from "./machinegun";
import machinegunParticles from "./machinegunParticles";
import stamp from "./stamp";
import stampParticles from "./stampParticles";
// import zapper from "./zapper";
import staticSprites from "./staticSprites";
const sprites = {
    hammer: {
        cursor: hammer,
        particles: hammerParticles,
        staticParticles: staticSprites.hammer,
    },
    machinegun: {
        cursor: machinegun,
        particles: machinegunParticles,
        staticParticles: staticSprites.machinegun,
    },
    stamp: {
        cursor: stamp,
        particles: stampParticles,
        staticParticles: staticSprites.stamp,
    },
};
export default sprites;
//# sourceMappingURL=index.js.map