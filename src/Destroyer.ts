import Weapon from "./Weapon";
import weaponFactory from "./weaponFactory";
import { Howler } from "howler";
import { Coordinates2D } from "./types";

export class Destroyer {
  clear: Function;
  currentWeapon: Weapon;
  currentWeaponID: number;
  cursorLayer: HTMLDivElement;
  drawingCTX: CanvasRenderingContext2D;
  drawingLayer: HTMLCanvasElement;
  handleKeyDown: Function;
  handleMouseDown: Function;
  handleMouseMove: Function;
  handleMouseUp: Function;
  inject: Function;
  isFiring: boolean;
  mousePos: Coordinates2D;
  parent: HTMLElement;
  particleLayer: HTMLDivElement;
  particleLimit: number;
  selfDestruct: Function;
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
    const opts = options || {};
    this.parent = parent;
    this.parent.classList.add("destroyer-parent");
    this.volume = 1;
    this.particleLimit = opts.particleLimit || 25;
    this.isFiring = false;
    // generate weapon objects and set default
    this.weaponsList = weaponFactory(this);
    this.currentWeaponID = 0;
    this.currentWeapon = this.weaponsList[this.currentWeaponID];

    // initiate cursor in center of parent
    this.mousePos = { x: parent.clientWidth / 2, y: parent.clientHeight / 2 };

    this.drawingLayer = document.createElement("canvas");
    this.drawingLayer.id = "destroyer-drawing-layer";
    this.drawingLayer.className = "destroyer-canvas drawing-layer";
    this.drawingLayer.width = parent.clientWidth;
    this.drawingLayer.height = parent.clientHeight;
    this.drawingCTX = this.drawingLayer.getContext("2d");

    // create div container to hold particles
    this.particleLayer = document.createElement("div");
    this.particleLayer.id = "destroyer-particle-layer";
    this.particleLayer.className = "destroyer-container particle-layer";

    // create div container to hold cursor
    this.cursorLayer = document.createElement("div");
    this.cursorLayer.id = "destroyer-sprite-layer";
    this.cursorLayer.className = "destroyer-container sprite-layer";

    // update css variables
    this.updateCSS = () => {
      const wpn = this.currentWeapon;
      parent.style.setProperty("--fire-rate", `${wpn.fireRate}ms`);
      parent.style.setProperty(
        "--wpn-sprite-frames",
        `${wpn.spriteFrames <= 2 ? wpn.spriteFrames - 1 : wpn.spriteFrames}`
      );
      parent.style.setProperty("--wpn-sprite-w", `${wpn.spriteW}px`);
      parent.style.setProperty("--wpn-sprite-h", `${wpn.spriteH}px`);
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
      if (this.currentWeaponID === this.weaponsList.length - 1) return;
      this.currentWeaponID++;
      this.updateCurrentWeapon();
    };

    this.weaponDown = () => {
      if (this.currentWeaponID === 0) return;
      this.currentWeaponID--;
      this.updateCurrentWeapon();
    };

    this.updateCurrentWeapon = () => {
      this.currentWeapon = this.weaponsList[this.currentWeaponID];
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
      parent.style.setProperty(
        "--wpn-sprite-x",
        `${e.clientX + this.currentWeapon.cursorOffset.x}px`
      );
      parent.style.setProperty(
        "--wpn-sprite-y",
        `${e.clientY + this.currentWeapon.cursorOffset.y}px`
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
          this.currentWeapon.fire();
        }, this.currentWeapon.fireRate);
        this.cursorLayer.addEventListener("mouseup", () =>
          handleMouseUp(fireInterval)
        );
      } else {
        this.currentWeapon.fire();
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
        three: 51,
        minus: 45,
        plus: 61,
        semicolon: 59,
        apostrophe: 39,
      };

      switch (code) {
        case keys.one:
          this.currentWeaponID = 0;
          this.updateCurrentWeapon();
          this.updateCSS();
          break;
        case keys.two:
          this.currentWeaponID = 1;
          this.updateCurrentWeapon();
          this.updateCSS();
          break;
        case keys.three:
          this.currentWeaponID = 2;
          this.updateCurrentWeapon();
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
      parent.style.position = "fixed";
      parent.style.cursor = "none";
      parent.style.setProperty("--z-index-start", `${zIndStart}`);

      // set up CSS variables
      this.updateCSS();

      // pack the cursor sprite into the cursor layer for rendering
      this.cursorLayer.appendChild(this.currentWeapon.spawn());

      // initiate listeners for cursor and key actions
      this.cursorLayer.addEventListener("mousemove", (e) => handleMouseMove(e));
      this.cursorLayer.addEventListener("mousedown", () => handleMouseDown());
      document.addEventListener("keypress", (e) => handleKeyDown(e));

      // render layers into the parent element
      parent.appendChild(this.drawingLayer);
      parent.appendChild(this.particleLayer);
      parent.appendChild(this.cursorLayer);
    };

    // remove all rendered content from the page, state is maintained behind the scenes and can be re-injected
    this.selfDestruct = () => {
      parent.style.cursor = "default";

      // remove listeners for cursor and key actions
      this.cursorLayer.removeEventListener("mousemove", (e) =>
        handleMouseMove(e)
      );
      this.cursorLayer.removeEventListener("mousedown", () =>
        handleMouseDown()
      );
      document.removeEventListener("keypress", (e) => handleKeyDown(e));

      // remove layers from the parent element
      parent.removeChild(this.drawingLayer);
      parent.removeChild(this.particleLayer);
      parent.removeChild(this.cursorLayer);
    };
  }
}

export default Destroyer;
