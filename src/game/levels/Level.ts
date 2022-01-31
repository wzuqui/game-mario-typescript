type LocationObjects = {
  image: HTMLImageElement;
  x: number;
  y: number;
  z: number;
}[];

export abstract class Level {
  protected readonly floorPlatformYPosition: number;

  constructor() {
    this.floorPlatformYPosition = 470;
  }

  abstract background(): LocationObjects;
  abstract platforms(): LocationObjects;
  abstract goombas(): LocationObjects;
}
