import { Coordinates2D, Dimensions2D } from "./types";
import { Howl } from "howler";

export class Particle {
  soundEffect: Howl;
  spriteRenderer: HTMLDivElement;
  viewFrame: HTMLDivElement;
  parentWidth: number;
  sprites;
  constructor(
    parentWidth,
    dimensions: Dimensions2D,
    coords: Coordinates2D,
    offset: Coordinates2D,
    sound,
    sprites
  ) {
    this.parentWidth = parentWidth;
    this.sprites = sprites;
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

    // generate the sound effect for this particle
    this.soundEffect = new Howl({
      src: [sound],
      autoplay: true,
      stereo: this.getStereoLocation(coords),
    });
  }

  // calculate where the sound origin is relative to the center of the viewport (-1 to 1)
  getStereoLocation(coords) {
    const location =
      -((Math.round(this.parentWidth / 2) - coords.x) / this.parentWidth) * 2;
    return location;
  }

  // returns th animated sprite
  getAnimatedContent() {
    this.viewFrame.appendChild(this.spriteRenderer); // pack the renderer into the view frame
    return this.viewFrame;
  }

  // returns the image to be drawn to canvas
  getStaticContent() {
    const staticContent = new Image();
    staticContent.src = this.sprites.static;
    return staticContent;
  }

  playSoundEffect() {
    this.soundEffect.play();
  }
}
export default Particle;
