import { createImage } from './createImage';
import spriteRunLeftImageSource from './img/spriteRunLeft.png';
import spriteRunRightImageSource from './img/spriteRunRight.png';
import spriteStandLeftImageSource from './img/spriteStandLeft.png';
import spriteStandRightImageSource from './img/spriteStandRight.png';

export class Player {
  width: number;
  height: number;
  speed: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  frames: number;
  sprites: {
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
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 20,
    };

    this.width = 66;
    this.height = 150;

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
      this.width,
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
}
