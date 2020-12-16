export class Weapon {
    constructor(game, sfx, sprites, options) {
        // instantiate object details
        this.animatedParticle = options.animatedParticle || false;
        this.animationCount = options.animationCount || 1;
        this.fireRate = options.fireRate || 1;
        this.name = options.name;
        this.particleOffset = options.particleOffset || 0;
        this.sfx = sfx;
        this.spriteFrames = options.spriteFrames || 1;
        this.sprites = Object.assign({}, sprites);
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
    }
}
export default Weapon;
//# sourceMappingURL=Weapon.js.map