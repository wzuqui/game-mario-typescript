import './style.css';

const xHTMLCanvasElement = document.querySelector('canvas');
const xCanvasRenderingContext2D = xHTMLCanvasElement.getContext('2d');

xHTMLCanvasElement.width = window.innerWidth;
xHTMLCanvasElement.height = window.innerHeight;

const xGravity = 1.5;

class Player {
  position = { x: 100, y: 100 };
  velocity = { x: 0, y: 20 };
  width = 30;
  height = 30;

  draw() {
    xCanvasRenderingContext2D.fillStyle = 'red';
    xCanvasRenderingContext2D.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (
      this.position.y + this.height + this.velocity.y <=
      xHTMLCanvasElement.height
    ) {
      this.velocity.y += xGravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

class Platform {
  width = 200;
  height = 20;

  constructor(public position: { x: number; y: number }) {}

  draw() {
    xCanvasRenderingContext2D.fillStyle = 'blue';
    xCanvasRenderingContext2D.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

const xPlayer = new Player();
const xPlatforms = [
  new Platform({ x: 200, y: 100 }),
  new Platform({ x: 500, y: 200 }),
];

const xKeys = {
  left: { pressed: false },
  right: { pressed: false },
};

let scrollOffset = 0;

function animate() {
  requestAnimationFrame(animate);
  // prettier-ignore
  xCanvasRenderingContext2D.clearRect(0, 0, xHTMLCanvasElement.width, xHTMLCanvasElement.height);
  xPlayer.update();
  xPlatforms.forEach((pPlatform) => pPlatform.draw());

  if (xKeys.right.pressed && xPlayer.position.x < 400) {
    xPlayer.velocity.x = 5;
  } else if (xKeys.left.pressed && xPlayer.position.x > 100) {
    xPlayer.velocity.x = -5;
  } else {
    xPlayer.velocity.x = 0;

    if (xKeys.right.pressed) {
      scrollOffset += 5;
      xPlatforms.forEach((pPlatform) => (pPlatform.position.x -= 5));
    } else if (xKeys.left.pressed) {
      scrollOffset -= 5;
      xPlatforms.forEach((pPlatform) => (pPlatform.position.x += 5));
    }
  }

  // platformCollisionDetect
  xPlatforms.forEach((pPlatform) => {
    // prettier-ignore
    if (xPlayer.position.y + xPlayer.height <= pPlatform.position.y
    && xPlayer.position.y + xPlayer.height + xPlayer.velocity.y >= pPlatform.position.y
    && xPlayer.position.x + xPlayer.width >= pPlatform.position.x
    && xPlayer.position.x <= pPlatform.position.x + pPlatform.width
    ) {
      xPlayer.velocity.y = 0;
    }
  });

  if (scrollOffset > 2000) {
    console.log('you win');
  }
}

animate();

window.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'ArrowLeft':
      xKeys.left.pressed = true;
      break;

    case 'ArrowDown':
      break;

    case 'ArrowRight':
      xKeys.right.pressed = true;
      break;

    case 'ArrowUp':
      if (xPlayer.velocity.y > -40) xPlayer.velocity.y -= 35;
      break;
  }
});

window.addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'ArrowLeft':
      xKeys.left.pressed = false;
      break;

    case 'ArrowDown':
      break;

    case 'ArrowRight':
      xKeys.right.pressed = false;
      break;

    case 'ArrowUp':
      break;
  }
});
