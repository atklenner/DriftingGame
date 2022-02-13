const MAX_VELOCITY = 0.075;
const MAX_REVERSE_VELOCITY = -0.025;
const ACCELERATION = 0.0001;
const DECELERATION = 0.0001;
const COAST = 0.00005;
const TURNING_RATE = 0.0025;

export default class Car {
  constructor(carElem) {
    this.carElem = carElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.carElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.carElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.carElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.carElem.style.setProperty("--y", value);
  }

  setDirection() {
    this.direction = { x: Math.cos(this.angle), y: -Math.sin(this.angle) };
  }

  accelerate(delta) {
    if (this.velocity < MAX_VELOCITY) {
      this.velocity += ACCELERATION * delta;
    }
  }

  decelerate(delta) {
    if (this.velocity > MAX_REVERSE_VELOCITY) {
      this.velocity -= DECELERATION * delta;
    }
  }

  coast(delta) {
    if (this.velocity > 0) {
      this.velocity -= COAST * delta;
    }
    if (this.velocity < 0) {
      this.velocity += COAST * delta;
    }
  }

  turnLeft(delta) {
    if (this.velocity !== 0) {
      this.angle += delta * TURNING_RATE;
      this.setDirection();
    }
  }

  turnRight(delta) {
    if (this.velocity !== 0) {
      this.angle -= delta * TURNING_RATE;
      this.setDirection();
    }
  }

  rect() {
    return this.carElem.getBoundingClientRect();
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.angle = Math.PI / 2;
    this.setDirection();
    this.velocity = 0;
  }

  update(delta) {
    this.x += this.direction.x * delta * this.velocity;
    this.y += this.direction.y * delta * this.velocity;
    const rect = this.rect();
    if (rect.top <= 0 || rect.bottom >= window.innerHeight) {
      this.velocity = this.velocity / 2;
      this.direction.y *= -1;
    }
    if (rect.right >= window.innerWidth || rect.left <= 0) {
      this.velocity = this.velocity / 2;
      this.direction.x *= -1;
    }
  }
}
