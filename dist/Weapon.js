import ParticleGenerator from "./ParticleGenerator";
import { sleep } from "./utils/sleep";
export class Weapon {
    constructor(game, sfx, sprites, options) {
        this.game = game;
        this.animatedParticle = options.animatedParticle || false;
        this.animationCount = options.animationCount || 1;
        this.fireRate = options.fireRate || 1;
        this.name = options.name;
        this.particleAnimationDuration = options.particleAnimationDuration || 0;
        this.particleOffset = Object.assign({}, options.particleOffset) || { x: 0, y: 0 };
        this.sfx = sfx;
        this.spriteFrames = options.spriteFrames || 1;
        this.sprites = Object.assign({}, sprites);
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
    }
    /** Pack the renderer into the frame and return content to be rendered */
    spawn() {
        this.viewFrame.appendChild(this.spriteRenderer);
        return this.viewFrame;
    }
    /** Fire a single shot */
    async fire() {
        const coords = Object.assign({}, this.game.mousePos); // grab the current cursor position
        // generate the particles to be rendered
        const particle = this.particleGenerator.generate(coords);
        const aParticle = particle.getAnimatedContent();
        const sParticle = particle.getStaticContent();
        particle.playSoundEffect();
        this.game.particleLayer.appendChild(aParticle); // render the animated sprite
        // wait for the animation to finish, then remove the animated sprite
        await sleep(this.particleAnimationDuration);
        this.game.particleLayer.removeChild(aParticle);
        // replace the animated sprite with a persisted image on the canvas
        this.game.drawingCTX.drawImage(sParticle, coords.x + this.particleOffset.x - 75, coords.y + this.particleOffset.y - 75);
        this.game.pageHealth -= this.damagePoints; // decrement page health by weapon's damage value
        this.game.onDamage();
    }
}
export default Weapon;
//# sourceMappingURL=Weapon.js.map