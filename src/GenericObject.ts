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
