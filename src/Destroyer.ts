import Weapon from "./Weapon";
import weaponFactory from "./weaponFactory";
import { Howler } from "howler";
import { Coordinates2D, DestroyerOptions } from "./types";

export class Destroyer {
  currentWeapon: Weapon;
  currentWeaponID: number;
  cursorLayer: HTMLDivElement;
  drawingCTX: CanvasRenderingContext2D;
  drawingLayer: HTMLCanvasElement;
  isFiring: boolean;
  mousePos: Coordinates2D;
  onDamage: Function;
  pageHealth: number;
  parent: HTMLElement;
  particleLayer: HTMLDivElement;
  particleLimit: number;
  volume: number;
  volumeChangeDelta: number;
  volumeHasBeenSet: boolean;
  weaponFiring: boolean;
  weaponsList: Weapon[];
  zIndexStart: number;
  constructor(parent: HTMLElement, options?: DestroyerOptions) {
    const opts = options || ({} as DestroyerOptions);

    // initiate variables
    this.isFiring = false;
    this.pageHealth = opts.pageHealth || 100;
    this.particleLimit = opts.particleLimit || 25; // how many animated particle sprites can exist at one time
    this.volume = opts.defaultVolume || 1; // default volume
    this.volumeChangeDelta = opts.volumeChangeDelta || 0.11; // how much to increment/decrement volume from hotkey
    this.zIndexStart = opts.zIndexStart || 1; // the z-index to begin layering
    this.volumeHasBeenSet = false;
    this.onDamage = opts.onDamage
      ? () => opts.onDamage(this.pageHealth)
      : () => {};

    this.parent = parent;
    this.parent.classList.add("destroyer-parent");
    !this.parent.style.width && (this.parent.style.width = "100%"); // parent must have a width > 0 or a divide-by-zero will occur
    this.parent.style.setProperty("--z-index-start", `${this.zIndexStart}`); // tell CSS where to begin layering
    this.parent.style.position = "fixed"; // force parent style to align layers
    this.parent.style.cursor = "none";

    // generate weapon objects and set default
    this.weaponsList = weaponFactory(this);
    this.currentWeaponID = 0;
    this.currentWeapon = this.weaponsList[this.currentWeaponID];
    this.mousePos = { x: parent.clientWidth / 2, y: parent.clientHeight / 2 }; // initiate cursor in center of parent

    // create canvas to persist particles after animation
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
  }

  /** Erase all persisted particles on drawing layer */
  clear() {
    this.drawingCTX.clearRect(
      0,
      0,
      this.drawingLayer.width,
      this.drawingLayer.height
    );
  }

  /** Inject elements into parent to begin rendering process */
  inject() {
    this.updateCSS(); // set up CSS variables
    this.cursorLayer.appendChild(this.currentWeapon.spawn()); // pack the cursor sprite into the cursor layer for rendering

    // initiate listeners for cursor and key actions
    this.cursorLayer.addEventListener("mousemove", (e) =>
      this.handleMouseMove(e)
    );
    this.cursorLayer.addEventListener("mousedown", () =>
      this.handleMouseDown()
    );
    document.addEventListener("keypress", (e) => this.handleKeyDown(e));

    // render layers into the parent element
    this.parent.appendChild(this.drawingLayer);
    this.parent.appendChild(this.particleLayer);
    this.parent.appendChild(this.cursorLayer);
  }

  /** Handle hotkeys */
  handleKeyDown(e) {
    const key = e.key;

    switch (key) {
      case "1":
        this.currentWeaponID = 0; // set weapon to hammer and update
        this.updateCurrentWeapon();
        this.updateCSS();
        break;
      case "2":
        this.currentWeaponID = 1; // set weapon to machinegun and update
        this.updateCurrentWeapon();
        this.updateCSS();
        break;
      case "3":
        this.currentWeaponID = 2; // set weapon to stamp and update
        this.updateCurrentWeapon();
        this.updateCSS();
        break;
      case "c":
        this.clear(); // clear persisted particles
        break;
      case "-":
        this.weaponDown(); // decrement currentWeaponID
        break;
      case "=":
        this.weaponUp(); // increment currentWeaponID
        break;
      case ";":
        this.volumeDown(); // decrement volume
        break;
      case "'":
        this.volumeUp(); // increment volume
        break;
      default:
        break;
    }
  }

  /** Begin firing */
  handleMouseDown() {
    // default volume must be initialized here to conform to browser autoplay rules
    if (!this.volumeHasBeenSet) {
      this.setVolume(this.volume);
      this.volumeHasBeenSet = true;
    }

    this.isFiring = true;
    this.cursorLayer.classList.add("animating"); // tell CSS to animate the cursor

    // if the weapon fire interval is greater than 1, begin a rapid firing loop, else fire one shot and stop.
    if (this.currentWeapon.animationCount !== 1) {
      const fireInterval = setInterval(() => {
        this.currentWeapon.fire();
      }, this.currentWeapon.fireRate);
      this.cursorLayer.addEventListener("mouseup", () =>
        this.handleMouseUp(fireInterval)
      );
    } else {
      this.currentWeapon.fire();
      this.cursorLayer.addEventListener("mouseup", () => this.handleMouseUp());
    }
  }

  /** Cease firing */
  handleMouseUp(interval?) {
    this.isFiring = false;
    this.cursorLayer.classList.remove("animating"); // tell CSS to stop animating

    // if a rapid fire loop is currently running, cancel it. Then remove the mouseup listener to prepare for next mousedown
    if (interval) {
      clearInterval(interval);
      this.cursorLayer.removeEventListener("mouseup", () =>
        this.handleMouseUp(interval)
      );
    } else
      this.cursorLayer.removeEventListener("mouseup", () =>
        this.handleMouseUp(interval)
      );
  }

  /** Track cursor position when the mouse is moved*/
  handleMouseMove(e: MouseEvent) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;
    this.parent.style.setProperty(
      "--wpn-sprite-x",
      `${e.clientX + this.currentWeapon.cursorOffset.x}px`
    );
    this.parent.style.setProperty(
      "--wpn-sprite-y",
      `${e.clientY + this.currentWeapon.cursorOffset.y}px`
    );
  }

  /** Explicitly set volume */
  setVolume(vol: number) {
    if (vol > 1 || vol < 0) return;
    this.volume = vol;
    Howler.volume(this.volume);
  }

  /** Increase volume */
  volumeUp() {
    if (this.volume >= 1) return;
    this.setVolume(this.volume + (this.volumeChangeDelta || 0.11));
    console.log("Volume:", this.volume);
  }

  /** Decrease volume */
  volumeDown() {
    if (this.volume <= 0) return;
    this.setVolume(this.volume - (this.volumeChangeDelta || 0.11));
    console.log("Volume:", this.volume);
  }

  /** Explicitly set weapon  by ID */
  setWeapon(wpn: number) {
    if (this.currentWeaponID === wpn) return;
    this.currentWeaponID = wpn;
    this.updateCurrentWeapon();
  }

  /** Cycle to next weapon */
  weaponUp() {
    if (this.currentWeaponID === this.weaponsList.length - 1) return;
    this.currentWeaponID++;
    this.updateCurrentWeapon();
  }

  /** Cycle to previous weapon */
  weaponDown() {
    if (this.currentWeaponID === 0) return;
    this.currentWeaponID--;
    this.updateCurrentWeapon();
  }

  /** Update currentWeapon information based on currentWeaponID */
  updateCurrentWeapon() {
    this.currentWeapon = this.weaponsList[this.currentWeaponID];
    this.updateCSS();
  }

  /** Remove all rendered content from the page, state is maintained behind the scenes and can be re-injected */
  selfDestruct() {
    this.parent.style.cursor = "default"; // turn the cursor back on

    // remove listeners for cursor and key actions
    this.cursorLayer.removeEventListener("mousemove", (e) =>
      this.handleMouseMove(e)
    );
    this.cursorLayer.removeEventListener("mousedown", () =>
      this.handleMouseDown()
    );
    document.removeEventListener("keypress", (e) => this.handleKeyDown(e));

    // remove layers from the parent element
    this.parent.removeChild(this.drawingLayer);
    this.parent.removeChild(this.particleLayer);
    this.parent.removeChild(this.cursorLayer);
  }

  /** Update CSS variables on parent element */
  updateCSS() {
    const wpn = this.currentWeapon;
    this.parent.style.setProperty("--fire-rate", `${wpn.fireRate}ms`);
    this.parent.style.setProperty(
      "--wpn-sprite-frames",
      `${wpn.spriteFrames <= 2 ? wpn.spriteFrames - 1 : wpn.spriteFrames}`
    );
    this.parent.style.setProperty("--wpn-sprite-w", `${wpn.spriteW}px`);
    this.parent.style.setProperty("--wpn-sprite-h", `${wpn.spriteH}px`);
    this.parent.style.setProperty("--animation-count", `${wpn.animationCount}`);
    this.parent.style.setProperty(
      "--wpn-sprite-url",
      `url(${wpn.sprites.cursor})`
    );
  }
}

export default Destroyer;
