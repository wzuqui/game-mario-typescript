export class GenericObject {
  width: number;
  height: number;
  position: { x: number; y: number };
  image: HTMLImageElement;

  constructor(
    private context: CanvasRenderingContext2D,
    { x, y, image }: { x: number; y: number; image: HTMLImageElement }
  ) {
    this.position = { x, y };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    this.context.drawImage(this.image, this.position.x, this.position.y);
  }
}

export class Goomba extends GenericObject {
  velocity: { x: number };
  direction: 'right' | 'left';

  constructor(
    context: CanvasRenderingContext2D,
    private options: {
      x: number;
      y: number;
      image: HTMLImageElement;
      max_x: number;
      min_x: number;
    }
  ) {
    super(context, options);
    this.velocity = { x: 3 };
    this.direction = 'right';
  }

  update() {
    this.draw();

    if (this.position.x >= this.options.max_x) {
      this.direction = 'left';
    }
    if (this.position.x <= this.options.min_x) {
      this.direction = 'right';
    }

    switch (this.direction) {
      case 'left':
        this.position.x -= this.velocity.x;
        break;

      case 'right':
        this.position.x += this.velocity.x;
        break;
    }
  }

  move(direction: 'left' | 'right', x: number) {
    switch (direction) {
      case 'left':
        this.position.x -= x;
        this.options.min_x -= x;
        this.options.max_x -= x;
        break;

      case 'right':
        this.position.x += x;
        this.options.min_x += x;
        this.options.max_x += x;
        break;
    }
  }
}
