import { Howl } from "howler";
export class Particle {
    constructor(game, coords, offset, sound, sprites) {
        // create the sprite view frame
        this.viewFrame = document.createElement("div");
        this.viewFrame.id = "destroyer-particle-sprite-view-frame";
        this.viewFrame.className = `destroyer-sprite particle-sprite-view-frame`;
        this.viewFrame.style.top = `${coords.y - 75 + offset.y}px`;
        this.viewFrame.style.left = `${coords.x - 75 + offset.x}px`;
        // create the spritesheet renderer
        this.spriteRenderer = document.createElement("div");
        this.spriteRenderer.id = "destroyer-particle-spriteRenderer";
        this.spriteRenderer.className = `destroyer-sprite particle-sprite-renderer`;
        this.spriteRenderer.style.backgroundImage = `url(${sprites.animated})`;
        // calculate where the sound origin is relative to the center of the viewport (-1 to 1)
        this.getStereoLocation = (coords) => {
            return (-((Math.round(game.parent.clientWidth / 2) - coords.x) /
                game.parent.clientWidth) * 2);
        };
        // generate the sound effect for this particle
        this.soundEffect = new Howl({
            src: [sound],
            autoplay: true,
            stereo: this.getStereoLocation(coords),
        });
        // returns th animated sprite
        this.getAnimatedContent = () => {
            // pack the renderer into the view frame
            this.viewFrame.appendChild(this.spriteRenderer);
            return this.viewFrame;
        };
        // returns the image to be drawn to canvas
        this.getStaticContent = () => {
            const staticContent = new Image();
            staticContent.src = sprites.static;
            return staticContent;
        };
        this.playSoundEffect = () => {
            this.soundEffect.play();
        };
    }
}
export default Particle;
//# sourceMappingURL=Particle.js.map