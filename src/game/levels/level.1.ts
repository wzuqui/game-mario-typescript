import { createImage } from '../createImage';
import backgroundImageSource from '../img/background.png';
import goombaImageSource from '../img/goomba.png';
import hillsImageSource from '../img/hills.png';
import platformImageSource from '../img/platform.png';
import platformSmallMoreTallImageSource from '../img/platformSmallMoreTall.png';
import platformSmallTallImageSource from '../img/platformSmallTall.png';
import { Level } from './Level';

export class Level1 extends Level {
  /**
   * width: 11643
   */
  private readonly backgroundImage: HTMLImageElement;
  /**
   * width: 7545
   */
  private readonly hillsImage: HTMLImageElement;
  /**
   * width: 580
   */
  private readonly platformImage: HTMLImageElement;
  /**
   * width:291
   */
  private readonly platformSmallTallImage: HTMLImageElement;
  /**
   * width:291
   */
  private readonly platformSmallMoreTallImage: HTMLImageElement;
  /**
   * width:76
   * height: 85
   */
  private readonly goombaImage: HTMLImageElement;

  constructor() {
    super();
    this.backgroundImage = createImage(backgroundImageSource);
    this.hillsImage = createImage(hillsImageSource);
    this.platformImage = createImage(platformImageSource);
    this.platformSmallTallImage = createImage(platformSmallTallImageSource);
    this.platformSmallMoreTallImage = createImage(platformSmallMoreTallImageSource);
    this.goombaImage = createImage(goombaImageSource);
  }

  background() {
    return [
      {
        image: this.backgroundImage,
        x: -1,
        y: -1,
        z: 0,
      },
      {
        image: this.hillsImage,
        x: -1,
        y: -1,
        z: 1,
      },
    ];
  }

  platforms() {
    return [
      {
        image: this.platformImage,
        x: -2,
        y: this.floorPlatformYPosition,
        z: 0,
      },
      {
        image: this.platformImage,
        x: 577,
        y: this.floorPlatformYPosition,
        z: 0,
      },
      {
        image: this.platformImage,
        x: 1156,
        y: this.floorPlatformYPosition,
        z: 0,
      },
      {
        image: this.platformSmallTallImage,
        x: 1445,
        y: 250,
        z: -1,
      },
      {
        image: this.platformImage,
        x: 2036,
        y: this.floorPlatformYPosition,
        z: 0,
      },
      {
        image: this.platformSmallMoreTallImage,
        x: 2036,
        y: 46,
        z: -1,
      },
      {
        image: this.platformSmallTallImage,
        x: 2327 - 2,
        y: 250,
        z: -2,
      },
    ];
  }

  goombas() {
    return [
      {
        image: this.goombaImage,
        x: 600,
        y: this.floorPlatformYPosition - this.goombaImage.height,
        z: 1,
        max_x: 800,
        min_x: 600,
      },
      {
        image: this.goombaImage,
        x: 1450,
        y: 165,
        z: 1,
        min_x: 1450,
        max_x: 1650,
      },
    ];
  }
}
