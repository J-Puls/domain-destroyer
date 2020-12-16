import ParticleRenderer from "./ParticleRenderer";
import Weapon from "./Weapon";
import weaponFactory from "./weaponFactory";
import { Howl, Howler } from "howler";

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export class Destroyer {
  clear: Function;
  currentWeapon: Weapon;
  currentWeaponID: number;
  cursorLayer: HTMLDivElement;
  drawingCTX: CanvasRenderingContext2D;
  drawingLayer: HTMLCanvasElement;
  fire: Function;
  handleKeyDown: Function;
  handleMouseDown: Function;
  handleMouseMove: Function;
  handleMouseUp: Function;
  inject: Function;
  isFiring: boolean;
  mousePos: { x: number; y: number };
  parent: HTMLElement;
  particleLayer: HTMLDivElement;
  particleLimit: number;
  particleRenderer: ParticleRenderer;
  setVolume: Function;
  setWeapon: Function;
  updateCSS: Function;
  weaponFiring: boolean;
  weaponsList: Weapon[];
  weaponUp: Function;
  weaponDown: Function;
  updateCurrentWeapon: Function;
  volume: number;
  volumeUp: Function;
  volumeDown: Function;
  constructor(parent: HTMLElement, zIndStart: number, options?) {
    this.volume = 1;

    this.particleLimit = options.particleLimit || 100;
    this.isFiring = false;
    // generate weapon objects and set default
    const weaponsList = weaponFactory(this);
    this.currentWeaponID = 0;
    this.currentWeapon = weaponsList[this.currentWeaponID];

    // initiate cursor in center of parent
    this.mousePos = { x: parent.clientWidth / 2, y: parent.clientHeight / 2 };
    const particleRenderer = new ParticleRenderer(this);

    this.drawingLayer = document.createElement("canvas");
    this.drawingLayer.id = "destroyer-drawing-layer";
    this.drawingLayer.className = "destroyer-canvas drawing-layer";
    this.drawingLayer.style.zIndex = `${zIndStart}`;
    this.drawingLayer.width = parent.clientWidth;
    this.drawingLayer.height = parent.clientHeight;
    this.drawingLayer.style.zIndex = `${zIndStart}`;
    this.drawingCTX = this.drawingLayer.getContext("2d");

    // create div container to hold particles
    this.particleLayer = document.createElement("div");
    this.particleLayer.id = "destroyer-particle-layer";
    this.particleLayer.className = "destroyer-container particle-layer";
    this.particleLayer.style.zIndex = `${zIndStart + 1}`;

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

    // allow user to adjust volume
    this.setVolume = (vol: number) => {
      if (vol > 1 || vol < 0) return;
      this.volume = vol;
      Howler.volume(this.volume);
    };
    this.volumeUp = () => {
      if (this.volume >= 1) return;
      this.setVolume(this.volume + 0.11);
      console.log("Volume:", this.volume);
    };
    this.volumeDown = () => {
      if (this.volume <= 0) return;
      this.setVolume(this.volume - 0.11);
      console.log("Volume:", this.volume);
    };

    // allow user to change weapon explicitly
    this.setWeapon = (wpn: number) => {
      if (this.currentWeaponID === wpn) return;
      this.currentWeaponID = wpn;
      this.updateCurrentWeapon();
    };

    this.weaponUp = () => {
      if (this.currentWeaponID === weaponsList.length - 1) return;
      this.currentWeaponID++;
      this.updateCurrentWeapon();
    };

    this.weaponDown = () => {
      if (this.currentWeaponID === 0) return;
      this.currentWeaponID--;
      this.updateCurrentWeapon();
    };

    this.updateCurrentWeapon = () => {
      this.currentWeapon = weaponsList[this.currentWeaponID];
      this.updateCSS();
    };

    // delete all particles currently rendered
    this.clear = () => {
      this.drawingCTX.clearRect(
        0,
        0,
        this.drawingLayer.width,
        this.drawingLayer.height
      );
    };

    // track cursor position when the mouse is moved
    const handleMouseMove = (e: MouseEvent) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
      parent.style.setProperty("--wpn-sprite-x", `${e.clientX - 75}px`);
      parent.style.setProperty("--wpn-sprite-y", `${e.clientY - 75}px`);
    };

    // generate a particle and play sound effect
    this.fire = async () => {
      const coords = { ...this.mousePos };
      const partLayer = this.particleLayer;

      // calculate where the cursor is horizontally on a scale of -1 to 1 for spacial audio
      const stereoPosition =
        ((Math.round(parent.clientWidth / 2) - this.mousePos.x) /
          parent.clientWidth) *
        2;

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
        stereo: -stereoPosition,
      });

      // play the sound effect and render a particle
      soundEffect.play();
      // pick a random particle sprite for the current weapon
      const particleNumber = Math.floor(
        Math.random() * this.currentWeapon.sprites.particles.length
      );
      const staticParticle = new Image();
      staticParticle.src = this.currentWeapon.sprites.staticParticles[
        particleNumber
      ];
      // if particle limit has been reached, remove the oldest particle
      if (partLayer.children.length >= this.particleLimit) {
        partLayer.removeChild(partLayer.firstChild);
      }

      const particle = particleRenderer.spawn(particleNumber, coords);
      this.particleLayer.appendChild(particle);
      // wait for the animation to finish, then remove the particle
      await sleep(250);
      this.particleLayer.removeChild(particle);

      this.drawingCTX.drawImage(
        staticParticle,
        coords.x + this.currentWeapon.particleOffset - 75,
        coords.y + this.currentWeapon.particleOffset - 75
      );
    };

    // begins firing
    const handleMouseDown = () => {
      this.isFiring = true;
      // tell CSS to animate the cursor
      this.cursorLayer.classList.add("animating");

      // if the weapon fire interval is greater than 1, begin a rapid firing loop, else fire one shot and stop.
      if (this.currentWeapon.animationCount !== 1) {
        const fireInterval = setInterval(() => {
          this.fire();
        }, this.currentWeapon.fireRate);
        this.cursorLayer.addEventListener("mouseup", () =>
          handleMouseUp(fireInterval)
        );
      } else {
        this.fire();
        this.cursorLayer.addEventListener("mouseup", () => handleMouseUp());
      }
    };

    // ceases firing
    const handleMouseUp = (interval?) => {
      this.isFiring = false;
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
      const keys = {
        c: 99,
        one: 49,
        two: 50,
        minus: 45,
        plus: 61,
        semicolon: 59,
        apostrophe: 39,
      };

      switch (code) {
        case keys.one:
          this.currentWeapon = weaponsList[0];
          this.updateCSS();
          break;
        case keys.two:
          this.currentWeapon = weaponsList[1];
          this.updateCSS();
          break;
        case keys.c:
          this.clear();
          break;
        case keys.minus:
          this.weaponDown();
          break;
        case keys.plus:
          this.weaponUp();
          break;
        case keys.semicolon:
          this.volumeDown();
          break;
        case keys.apostrophe:
          this.volumeUp();
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
      parent.appendChild(this.drawingLayer);
      parent.appendChild(this.particleLayer);
      parent.appendChild(this.cursorLayer);
    };
  }
}

export default Destroyer;
