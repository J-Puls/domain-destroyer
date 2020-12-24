import ParticleGenerator from "./ParticleGenerator";
import { sleep } from "./utils/sleep";
export class Weapon {
    constructor(game, sfx, sprites, options) {
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
        this.cursorOffset = options.cursorOffset || { x: 0, y: 0 };
        this.particleGenerator = new ParticleGenerator(this, game);
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
        // fires a single shot
        this.fire = async () => {
            // grab the current cursor position
            const coords = Object.assign({}, game.mousePos);
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
            game.drawingCTX.drawImage(sParticle, coords.x + this.particleOffset.x - 75, coords.y + this.particleOffset.y - 75);
        };
    }
}
export default Weapon;
//# sourceMappingURL=Weapon.js.map