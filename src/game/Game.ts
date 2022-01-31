import { GameKeys } from './GameKeys';
import { GenericObject, Goomba } from './GenericObject';
import { Level } from './levels/Level';
import { Level1 } from './levels/level.1';
import { Platform } from './Platform';
import { Player } from './Player';

export class Game {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  floorPlatformYPosition: number;
  genericObjects!: GenericObject[];
  goombas!: Goomba[];
  gravity: number;
  keys!: GameKeys;
  lastKey?: 'right' | 'left';
  level: Level1;
  platforms!: Platform[];
  player!: Player;
  playerIsOnTheFloor!: boolean;
  scrollOffset!: number;

  constructor() {
    this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = 1024;
    this.canvas.height = 576;
    this.gravity = 1.5;

    this.floorPlatformYPosition = 470;

    this.level = new Level1();

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
    this.createGoombas();

    this.player = new Player(this.canvas, this.context, this.gravity);
  }

  private createBackground() {
    this.genericObjects = this.level
      .background()
      .sort(p => p.z)
      .map(
        b =>
          new GenericObject(this.context, {
            x: b.x,
            y: b.y,
            image: b.image,
          })
      );
  }

  private createPlatforms() {
    this.platforms = this.level
      .platforms()
      .sort(p => p.z)
      .map(
        p =>
          new Platform(this.context, {
            x: p.x,
            y: p.y,
            image: p.image,
          })
      );
  }

  private createGoombas() {
    this.goombas = this.level
      .goombas()
      .sort(p => p.z)
      .map(
        p =>
          new Goomba(this.context, {
            x: p.x,
            y: p.y,
            max_x: p.max_x,
            min_x: p.min_x,
            image: p.image,
          })
      );
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.genericObjects.forEach(genericObject => genericObject.draw());
    this.platforms.forEach(platform => platform.draw());
    this.goombas.forEach(goomba => goomba.update());
    this.player.update();

    const player_max_position_x = 400;
    const player_min_position_x = 100;
    const parallax_multiplier = 0.66;

    if (this.keys.right.pressed && this.player.position.x < player_max_position_x) {
      this.player.velocity.x = this.player.speed;
    } else if (
      (this.keys.left.pressed && this.player.position.x > player_min_position_x) ||
      (this.keys.left.pressed && this.scrollOffset === 0 && this.player.position.x > 0)
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
        this.goombas.forEach(goomba => {
          goomba.move('left', this.player.speed);
        });
      } else if (this.keys.left.pressed && this.scrollOffset > 0) {
        this.scrollOffset -= this.player.speed;
        this.platforms.forEach(platform => {
          platform.position.x += this.player.speed;
        });
        this.genericObjects.forEach(genericObject => {
          genericObject.position.x += this.player.speed * parallax_multiplier;
        });
        this.goombas.forEach(goomba => {
          goomba.move('right', this.player.speed);
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
    const last_platform = this.level
      .platforms()
      .sort(p => p.x + p.image.width)
      .reverse()
      .pop();
    const scrollOffsetPositionWin = last_platform!.image.width * 5 + 300 - 2;
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
