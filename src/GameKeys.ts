export class GameKeys {
  left: { pressed: boolean };
  right: { pressed: boolean };
  up: { pressed: boolean };
  constructor() {
    this.left = { pressed: false };
    this.right = { pressed: false };
    this.up = { pressed: false };
  }
}
