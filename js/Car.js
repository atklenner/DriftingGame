const MAX_VELOCITY = 0.75; // px/ms
const MAX_REVERSE_VELOCITY = -0.25;
const ACCELERATION = 0.001; // px/ms^2
const DECELERATION = 0.001;
const COAST = 0.0005;
const TURNING_RATE = 0.005; // tan(steering angle(= 20.5deg)) / car length(= 75px)

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
      this.angle += delta * this.velocity * TURNING_RATE;
      this.setDirection();
    }
  }

  turnRight(delta) {
    if (this.velocity !== 0) {
      this.angle -= delta * this.velocity * TURNING_RATE;
      this.setDirection();
    }
  }

  rect() {
    return this.carElem.getBoundingClientRect();
  }

  reset() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.angle = Math.PI / 2;
    this.setDirection();
    this.velocity = 0;
  }

  update(delta) {
    this.x += this.direction.x * delta * this.velocity;
    this.y += this.direction.y * delta * this.velocity;

    const rect = this.rect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
      this.reset();
    }
    if (rect.left >= window.innerWidth || rect.right <= 0) {
      this.reset();
    }
  }
}
