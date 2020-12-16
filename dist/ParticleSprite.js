import particle from "./sprites/hammerParticle";
export class ParticleSprite {
    constructor(game) {
        this.inject = () => {
            const particleLayer = game.particleLayer;
            const part = document.createElement("div");
            part.id = `destroyer-particle-sprite-${game.particleLayer.children.length}`;
            part.className = `destroyer-sprite particle-sprite`;
            part.style.width = "150px";
            part.style.height = "150px";
            part.style.position = "absolute";
            part.style.zIndex = `${game.zIndStart}`;
            part.style.backgroundImage = `url(${particle[Math.floor(Math.random() * particle.length)]})`;
            part.style.top = `${game.mousePos.y - 75}px`;
            part.style.left = `${game.mousePos.x - 75}px`;
            particleLayer.appendChild(part);
        };
    }
}
export default ParticleSprite;
//# sourceMappingURL=ParticleSprite.js.map