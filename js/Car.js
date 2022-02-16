const ENGINE_FORCE = 0.001; // px/ms^2, force / mass
const BRAKING_FORCE = 0.001;
const DRAG = 0.0005;
const TURNING_RATE = 0.005; // tan(steering angle(= 20.5deg)) / car length(= 75px)

// https://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html
// https://www.xarg.org/book/kinematics/ackerman-steering/
// http://entertain.univie.ac.at/~hlavacs/publications/car_model06.pdf
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

  getAcceleration() {
    if (this.accelerating) {
      return ENGINE_FORCE;
    }
    return 0;
  }

  getDeceleration() {
    if (this.decelerating) {
      return BRAKING_FORCE;
    }
    return 0;
  }

  getFriction() {
    return Math.abs(DRAG * this.velocity);
  }

  getTurningRate() {
    if (this.turningLeft) {
      return TURNING_RATE;
    }
    if (this.turningRight) {
      return -1 * TURNING_RATE;
    }
    return 0;
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
    this.accelerating = false;
    this.decelerating = false;
    this.turningLeft = false;
    this.turningRight = false;
  }

  update(delta) {
    this.x +=
      this.direction.x * delta * this.velocity +
      (this.getAcceleration() * delta * delta) / 2;
    this.y +=
      this.direction.y * delta * this.velocity +
      (this.getAcceleration() * delta * delta) / 2;

    this.velocity +=
      (this.getAcceleration() - this.getDeceleration() - this.getFriction()) *
      delta;

    this.angle += delta * this.velocity * this.getTurningRate();
    this.setDirection();

    const rect = this.rect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
      this.reset();
    }
    if (rect.left >= window.innerWidth || rect.right <= 0) {
      this.reset();
    }
  }
}
