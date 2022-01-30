import { createImage } from './createImage';
import { GameKeys } from './GameKeys';
import spriteRunLeftImageSource from './img/spriteRunLeft.png';
import spriteRunRightImageSource from './img/spriteRunRight.png';
import spriteStandLeftImageSource from './img/spriteStandLeft.png';
import spriteStandRightImageSource from './img/spriteStandRight.png';

export class Player {
  public readonly speed: number;
  public readonly position: { x: number; y: number };
  public readonly velocity: { x: number; y: number };

  public get width() {
    return this._width;
  }
  public get height() {
    return this._height;
  }

  private readonly jumpHeight: number;
  private _height: number;
  private _width: number;
  private frames: number;
  private sprites: {
    stand: {
      right: HTMLImageElement;
      left: HTMLImageElement;
      cropWidth: number;
      width: number;
    };
    run: {
      right: HTMLImageElement;
      left: HTMLImageElement;
      cropWidth: number;
      width: number;
    };
  };
  currentSprinte: HTMLImageElement;
  currentCropWidth: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private gravity: number
  ) {
    this.speed = 10;
    this.jumpHeight = -25;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 20,
    };

    this._width = 66;
    this._height = 150;

    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(spriteStandRightImageSource),
        left: createImage(spriteStandLeftImageSource),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createImage(spriteRunRightImageSource),
        left: createImage(spriteRunLeftImageSource),
        cropWidth: 341,
        width: 127.875,
      },
    };
    this.currentSprinte = this.sprites.stand.right;
    this.currentCropWidth = this.sprites.stand.cropWidth;
  }

  draw() {
    this.context.drawImage(
      this.currentSprinte,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this._width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprinte === this.sprites.stand.right ||
        this.currentSprinte === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames > 29 &&
      (this.currentSprinte === this.sprites.run.right ||
        this.currentSprinte === this.sprites.run.left)
    ) {
      this.frames = 0;
    }
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= this.canvas.height) {
      this.velocity.y += this.gravity;
    }
  }

  jump() {
    this.velocity.y = this.jumpHeight;
  }

  spriteSwitching(keys: GameKeys, lastKey?: 'right' | 'left') {
    if (
      keys.right.pressed &&
      lastKey === 'right' &&
      this.currentSprinte !== this.sprites.run.right
    ) {
      this.frames = 1;
      this.currentSprinte = this.sprites.run.right;
      this.currentCropWidth = this.sprites.run.cropWidth;
      this._width = this.sprites.run.width;
    } else if (
      keys.left.pressed &&
      lastKey === 'left' &&
      this.currentSprinte !== this.sprites.run.left
    ) {
      this.frames = 1;
      this.currentSprinte = this.sprites.run.left;
      this.currentCropWidth = this.sprites.run.cropWidth;
      this._width = this.sprites.run.width;
    } else if (
      !keys.right.pressed &&
      lastKey === 'right' &&
      this.currentSprinte !== this.sprites.stand.right
    ) {
      this.frames = 1;
      this.currentSprinte = this.sprites.stand.right;
      this.currentCropWidth = this.sprites.stand.cropWidth;
      this._width = this.sprites.stand.width;
    } else if (
      !keys.left.pressed &&
      lastKey === 'left' &&
      this.currentSprinte !== this.sprites.stand.left
    ) {
      this.frames = 1;
      this.currentSprinte = this.sprites.stand.left;
      this.currentCropWidth = this.sprites.stand.cropWidth;
      this._width = this.sprites.stand.width;
    }
  }
}
