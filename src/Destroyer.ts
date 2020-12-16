import ParticleRenderer from "./ParticleRenderer";
import Weapon from "./Weapon";
import weaponFactory from "./weaponFactory";
import { Howl } from "howler";

export class Destroyer {
  clear: Function;
  handleKeyDown: Function;
  handleMouseDown: Function;
  handleMouseMove: Function;
  handleMouseUp: Function;
  mousePos: { x: number; y: number };
  parent: HTMLElement;
  particleLayer: HTMLDivElement;
  particleRenderer: ParticleRenderer;
  cursorLayer: HTMLDivElement;
  updateCSS: Function;
  currentWeapon: Weapon;
  weaponFiring: boolean;
  weaponsList: Weapon[];
  particleLimit: number;
  inject: Function;

  constructor(parent: HTMLElement, zIndStart: number, options?) {
    this.particleLimit = options.particleLimit || 100;

    // generate weapon objects and set default
    const weaponsList = weaponFactory(this);
    this.currentWeapon = weaponsList[0];

    // initiate cursor in center of parent
    this.mousePos = { x: parent.clientWidth / 2, y: parent.clientHeight / 2 };
    const particleRenderer = new ParticleRenderer(this);

    // create div container to hold particles
    this.particleLayer = document.createElement("div");
    this.particleLayer.id = "destroyer-particle-layer";
    this.particleLayer.className = "destroyer-container particle-layer";
    this.particleLayer.style.zIndex = `${zIndStart}`;

    // create div container to hold cursor
    this.cursorLayer = document.createElement("div");
    this.cursorLayer.id = "destroyer-sprite-layer";
    this.cursorLayer.className = "destroyer-container sprite-layer";
    this.cursorLayer.style.zIndex = `${zIndStart + 1}`;

    // update css variables
    this.updateCSS = () => {
      const wpn = this.currentWeapon;
      parent.style.setProperty("--fire-rate", `${wpn.fireRate}ms`);
      parent.style.setProperty(
        "--frames",
        `${wpn.spriteFrames <= 2 ? wpn.spriteFrames - 1 : wpn.spriteFrames}`
      );
      parent.style.setProperty("--animation-count", `${wpn.animationCount}`);
      parent.style.setProperty(
        "--wpn-sprite-url",
        `url(${wpn.sprites.cursor})`
      );
    };

    // delete all particles currently rendered
    this.clear = () => {
      while (this.particleLayer.firstChild) {
        this.particleLayer.removeChild(this.particleLayer.firstChild);
      }
    };

    // track cursor position when the mouse is moved
    const handleMouseMove = (e: MouseEvent) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
      parent.style.setProperty("--wpn-sprite-x", `${e.clientX - 75}px`);
      parent.style.setProperty("--wpn-sprite-y", `${e.clientY - 75}px`);
    };

    // generate a particle and play sound effect
    const fire = () => {
      const partLayer = this.particleLayer;

      // if particle limit has been reached, remove the oldest particle
      if (partLayer.children.length >= this.particleLimit) {
        partLayer.removeChild(partLayer.firstChild);
      }

      // sound effect must be generated here to play nice with browser autoplay rules
      const soundEffect = new Howl({
        src: [
          `${
            this.currentWeapon.sfx[
              Math.floor(Math.random() * this.currentWeapon.sfx.length)
            ]
          }`,
        ],
        autoplay: true,
      });

      // play the sound effect and render a particle
      soundEffect.play();
      this.particleLayer.appendChild(particleRenderer.spawn());
    };

    // begins firing
    const handleMouseDown = () => {
      // tell CSS to animate the cursor
      this.cursorLayer.classList.add("animating");

      // if the weapon fire interval is greater than 1, begin a rapid firing loop, else fire one shot and stop.
      if (this.currentWeapon.animationCount !== 1) {
        const fireInterval = setInterval(() => {
          fire();
        }, this.currentWeapon.fireRate);
        this.cursorLayer.addEventListener("mouseup", () =>
          handleMouseUp(fireInterval)
        );
      } else {
        fire();
        this.cursorLayer.addEventListener("mouseup", () => handleMouseUp());
      }
    };

    // ceases firing
    const handleMouseUp = (interval?) => {
      // tell CSS to stop animating
      this.cursorLayer.classList.remove("animating");

      // if a rapid fire loop is currently running, cancel it. Then remove the mouseup listener
      if (interval) {
        clearInterval(interval);
        this.cursorLayer.removeEventListener("mouseup", () =>
          handleMouseUp(interval)
        );
      } else
        this.cursorLayer.removeEventListener("mouseup", () => handleMouseUp());
    };

    // handle keydown events for changing weapons, clearing particles, etc...
    const handleKeyDown = (e) => {
      const code = e.keyCode;
      const keyC = 99;
      const key1 = 49;
      const key2 = 50;
      switch (code) {
        case key1:
          this.currentWeapon = weaponsList[0];
          this.updateCSS();
          break;
        case key2:
          this.currentWeapon = weaponsList[1];
          this.updateCSS();
          break;
        case keyC:
          this.clear();
          break;
        default:
          break;
      }
    };

    // layers must be injected into parent to begin rendering process
    this.inject = () => {
      // force parent relative to align layers and remove the default cursor
      parent.style.position = "relative";
      parent.style.cursor = "none";

      // pack the cursor sprite into the cursor layer for rendering
      this.cursorLayer.appendChild(this.currentWeapon.spawn());

      // set up CSS variables
      this.updateCSS();

      // initiate listeners for cursor and key actions
      this.cursorLayer.addEventListener("mousemove", (e) => handleMouseMove(e));
      this.cursorLayer.addEventListener("mousedown", () => handleMouseDown());
      document.addEventListener("keypress", (e) => handleKeyDown(e));

      // render layers into the parent element
      parent.appendChild(this.particleLayer);
      parent.appendChild(this.cursorLayer);
    };
  }
}

export default Destroyer;
