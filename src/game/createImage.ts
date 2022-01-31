export function createImage(imageSource: string) {
  const image = new Image();
  image.src = imageSource;
  return image;
}
