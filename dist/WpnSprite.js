import hammer from "./sprites/hammer";
export class WpnSprite {
    constructor(game) {
        this.game = game;
        this.x = game.mousePos.x;
        this.y = game.mousePos.y;
        this.renderer = document.createElement("div");
        this.renderer.id = "destroyer-weapon-sprite";
        this.renderer.className = `destroyer-sprite weapon-sprite`;
        this.renderer.style.width = "150px";
        this.renderer.style.height = "150px";
        this.renderer.style.position = "absolute";
        this.renderer.style.zIndex = `${this.game.zIndStart + 2}`;
        this.inject = () => {
            this.game.spriteLayer.appendChild(this.renderer);
        };
        this.beginFire = () => {
            this.game.currentWpnSprite = hammer.frame2;
        };
        this.ceaseFire = () => {
            this.game.currentWpnSprite = hammer.frame1;
        };
    }
}
export default WpnSprite;
//# sourceMappingURL=WpnSprite.js.map