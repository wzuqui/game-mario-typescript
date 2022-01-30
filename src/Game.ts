import { createImage } from './createImage';
import { GameKeys } from './GameKeys';
import { GenericObject } from './GenericObject';
import backgroundImageSource from './img/background.png';
import hillsImageSource from './img/hills.png';
import platformImageSource from './img/platform.png';
import platformSmallTallImageSource from './img/platformSmallTall.png';
import { Platform } from './Platform';
import { Player } from './Player';

export class Game {
  scrollOffset!: number;
  platformImage!: HTMLImageElement;
  player!: Player;
  platforms!: Platform[];
  genericObjects!: GenericObject[];
  keys!: GameKeys;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  gravity: number;
  backgroundImage: HTMLImageElement;
  hillsImage: HTMLImageElement;
  platformSmallTallImage: HTMLImageElement;
  floorPlatformYPosition: number;
  lastKey?: 'right' | 'left';
  playerIsOnTheFloor!: boolean;

  constructor() {
    this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = 1024;
    this.canvas.height = 576;
    this.gravity = 1.5;

    this.platformImage = createImage(platformImageSource);
    this.backgroundImage = createImage(backgroundImageSource);
    this.hillsImage = createImage(hillsImageSource);
    this.platformSmallTallImage = createImage(platformSmallTallImageSource);
    this.floorPlatformYPosition = 470;

    this.init();
    this.animate();
    this.subscribeKeys();
  }

  init() {
    this.scrollOffset = 0;
    this.playerIsOnTheFloor = false;
    this.keys = new GameKeys();

    this.createBackground();
    this.createPlatforms();

    this.player = new Player(this.canvas, this.context, this.gravity);
  }

  private createBackground() {
    this.genericObjects = [
      new GenericObject(this.context, {
        x: -1,
        y: -1,
        image: this.backgroundImage,
      }),
      new GenericObject(this.context, {
        x: -1,
        y: -1,
        image: this.hillsImage,
      }),
    ];
  }

  private createPlatforms() {
    this.platforms = [
      ...newPlatform(this, 1, 400, 250, this.platformSmallTallImage),
      ...newPlatform(this, 2),
      ...newPlatform(
        this,
        1,
        2 * this.platformImage.width + 350,
        250,
        this.platformSmallTallImage
      ),
      ...newPlatform(this, 1, 2 * this.platformImage.width + 300),
    ];
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.genericObjects.forEach(genericObject => genericObject.draw());
    this.platforms.forEach(platform => platform.draw());
    this.player.update();

    const player_max_position_x = 400;
    const player_min_position_x = 100;
    const parallax_multiplier = 0.66;

    if (
      this.keys.right.pressed &&
      this.player.position.x < player_max_position_x
    ) {
      this.player.velocity.x = this.player.speed;
    } else if (
      (this.keys.left.pressed &&
        this.player.position.x > player_min_position_x) ||
      (this.keys.left.pressed &&
        this.scrollOffset === 0 &&
        this.player.position.x > 0)
    ) {
      this.player.velocity.x = -this.player.speed;
    } else {
      this.player.velocity.x = 0;

      if (this.keys.right.pressed) {
        this.scrollOffset += this.player.speed;
        this.platforms.forEach(platform => {
          platform.position.x -= this.player.speed;
        });
        this.genericObjects.forEach(genericObject => {
          genericObject.position.x -= this.player.speed * parallax_multiplier;
        });
      } else if (this.keys.left.pressed && this.scrollOffset > 0) {
        this.scrollOffset -= this.player.speed;
        this.platforms.forEach(platform => {
          platform.position.x += this.player.speed;
        });
        this.genericObjects.forEach(genericObject => {
          genericObject.position.x += this.player.speed * parallax_multiplier;
        });
      }
    }

    // platformCollisionDetect
    this.platforms.forEach(platform => {
      if (
        this.player.position.y + this.player.height <= platform.position.y &&
        this.player.position.y + this.player.height + this.player.velocity.y >=
          platform.position.y &&
        this.player.position.x + this.player.width >= platform.position.x &&
        this.player.position.x <= platform.position.x + platform.width
      ) {
        this.player.velocity.y = 0;
        this.playerIsOnTheFloor = true;
      }
    });

    // spriteSwitching
    this.player.spriteSwitching(this.keys, this.lastKey);

    // win condition
    const scrollOffsetPositionWin = this.platformImage.width * 5 + 300 - 2;
    if (this.scrollOffset > scrollOffsetPositionWin) {
    }

    // lose condition
    if (this.player.position.y > this.canvas.height) {
      this.init();
    }
  }

  subscribeKeys() {
    window.addEventListener('keydown', ({ key }) => {
      switch (key) {
        case 'ArrowLeft':
          this.keys.left.pressed = true;
          this.lastKey = 'left';
          break;

        case 'ArrowDown':
          break;

        case 'ArrowRight':
          this.keys.right.pressed = true;
          this.lastKey = 'right';
          break;

        case 'ArrowUp':
          if (!this.keys.up.pressed && this.playerIsOnTheFloor) {
            this.playerIsOnTheFloor = false;
            this.player.jump();
          }
          this.keys.up.pressed = true;
          break;
      }
    });

    window.addEventListener('keyup', ({ key }) => {
      switch (key) {
        case 'ArrowLeft':
          this.keys.left.pressed = false;
          break;

        case 'ArrowDown':
          break;

        case 'ArrowRight':
          this.keys.right.pressed = false;
          break;

        case 'ArrowUp':
          this.keys.up.pressed = false;
          break;
      }
    });
  }
}

function newPlatform(
  that: Game,
  size: number,
  x?: number,
  y?: number,
  image?: HTMLImageElement
): Platform[] {
  x ??= -1;
  y ??= that.floorPlatformYPosition;
  image ??= that.platformImage;

  const result: Platform[] = [];

  for (let index = 0; index < size; index++) {
    result.push(
      new Platform(that.context, {
        x: x + index * (image.width - 2),
        y,
        image,
      })
    );
  }

  return result;
}
