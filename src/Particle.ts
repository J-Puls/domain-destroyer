import { Coordinates2D, Dimensions2D } from "./types";
import { Howl } from "howler";

export class Particle {
  getAnimatedContent: Function;
  getStaticContent: Function;
  getStereoLocation: Function;
  playSoundEffect: Function;
  soundEffect: Howl;
  spriteRenderer: HTMLDivElement;
  viewFrame: HTMLDivElement;

  constructor(
    parentWidth,
    dimensions: Dimensions2D,
    coords: Coordinates2D,
    offset: Coordinates2D,
    sound,
    sprites
  ) {
    // create the sprite view frame
    this.viewFrame = document.createElement("div");
    this.viewFrame.id = "destroyer-particle-sprite-view-frame";
    this.viewFrame.className = `destroyer-sprite particle-sprite-view-frame`;
    this.viewFrame.style.top = `${coords.y - dimensions.h / 2 + offset.y}px`;
    this.viewFrame.style.left = `${coords.x - dimensions.w / 2 + offset.x}px`;

    // create the spritesheet renderer
    this.spriteRenderer = document.createElement("div");
    this.spriteRenderer.id = "destroyer-particle-spriteRenderer";
    this.spriteRenderer.className = `destroyer-sprite particle-sprite-renderer`;
    this.spriteRenderer.style.backgroundImage = `url(${sprites.animated})`;

    // calculate where the sound origin is relative to the center of the viewport (-1 to 1)
    this.getStereoLocation = (coords) => {
      const location =
        -((Math.round(parentWidth / 2) - coords.x) / parentWidth) * 2;
      return location;
    };

    // generate the sound effect for this particle
    this.soundEffect = new Howl({
      src: [sound],
      autoplay: true,
      stereo: this.getStereoLocation(coords),
    });

    // returns th animated sprite
    this.getAnimatedContent = () => {
      this.viewFrame.appendChild(this.spriteRenderer); // pack the renderer into the view frame
      return this.viewFrame;
    };

    // returns the image to be drawn to canvas
    this.getStaticContent = () => {
      const staticContent = new Image();
      staticContent.src = sprites.static;
      return staticContent;
    };

    this.playSoundEffect = () => this.soundEffect.play();
  }
}
export default Particle;
