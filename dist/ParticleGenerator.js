export class ParticleGenerator {
    constructor(game) {
        // returns the elements to render a particle
        this.generate = (weapon, partNum, coords) => {
            // create the sprite view frame
            this.viewFrame = document.createElement("div");
            this.viewFrame.id = "destroyer-particle-sprite-view-frame";
            this.viewFrame.className = `destroyer-sprite particle-sprite-view-frame`;
            this.viewFrame.style.zIndex = `${game.zIndStart + 1}`;
            this.viewFrame.style.top = `${coords.y - 75 + weapon.particleOffset.y}px`;
            this.viewFrame.style.left = `${coords.x - 75 + weapon.particleOffset.x}px`;
            // create the spritesheet renderer
            this.spriteRenderer = document.createElement("div");
            this.spriteRenderer.id = "destroyer-particle-spriteRenderer";
            this.spriteRenderer.className = `destroyer-sprite particle-sprite-renderer`;
            this.spriteRenderer.style.backgroundImage = `url(${weapon.sprites.particles[partNum]})`;
            this.spriteRenderer.style.zIndex = `${game.zIndStart + 2}`;
            // pack the renderer into the view frame
            this.viewFrame.appendChild(this.spriteRenderer);
            return this.viewFrame;
        };
    }
}
export default ParticleGenerator;
//# sourceMappingURL=ParticleGenerator.js.map